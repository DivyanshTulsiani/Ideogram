import shutil
from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
# from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_huggingface import HuggingFaceEmbeddings
from langchain.prompts import ChatPromptTemplate
from langchain_community.vectorstores import Chroma
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader
import chromadb
from chromadb.utils import embedding_functions
from io import BytesIO
import tempfile
import re, json
import os
from langchain_community.vectorstores import FAISS
from chromadb.config import  Settings
# import faiss
app = FastAPI()

# # ephemeral store per user
# user_stores = {}


# A global dictionary to map user IDs to collection names
user_collections = {}

# Initialize the persistent Chroma client once at startup
# All user data will be stored in the 'vectorstores' directory
# persistent_client = chromadb.PersistentClient(path="./vectorstores",settings=Settings(allow_reset=True))

persistent_client = chromadb.EphemeralClient()

# persistent_client.reset()

# You can reuse the HuggingFaceEmbeddings model for consistency
embeddings = embedding_functions.SentenceTransformerEmbeddingFunction(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

class DiagramRequest(BaseModel):
    user_id: str
    prompt: str

os.environ["GOOGLE_API_KEY"] = os.getenv("GEMINI_API_KEY")

# # embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

# embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

#shift to chromadb client
@app.post("/upload-pdf/{user_id}")
async def upload_pdf(user_id: str, file: UploadFile = File(...)):
    #we have to sanitize user id as collection name should not include special characters
    sanitized_user_id = re.sub(r'[^a-zA-Z0-9._-]', '_', user_id)
    collection_name = f"user-{sanitized_user_id}-docs"
    persistent_client.list_collections()
    # this checks if connection present before
    try:
        persistent_client.delete_collection(collection_name)
    except Exception as e:
        # This will raise an exception if the collection doesn't exist,
        # which we can safely ignore.
        print(f"Collection '{collection_name}' not found, creating a new one.")
        
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name

    # currently using PyPDFLoader will shift if available
    loader = PyPDFLoader(tmp_path)
    documents = loader.load()
    os.remove(tmp_path)


    # Split into chunks
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    docs = text_splitter.split_documents(documents)
    
    #new way we are creating a chromadb client instead of storing it directly in disk
     # The `get_or_create_collection` method is crucial.
    # It gets the collection if it exists or creates a new one,
    # ensuring no overwrites or file-locking conflicts.
    collection = persistent_client.get_or_create_collection(
        name=collection_name, embedding_function=embeddings
    )
    # #this deletes this users old items
    # collection.delete(where={})

        # 5. Add documents to the collection
    # The native `add` method takes content, metadata, and unique IDs
    collection.add(
        documents=[doc.page_content for doc in docs],
        metadatas=[doc.metadata for doc in docs],
        ids=[f"id-{sanitized_user_id}-{i}" for i in range(len(docs))],
    )
    # vectorstore = FAISS.from_documents(docs, embeddings)
    # print("Vectorstore built for user:", user_id, "with", len(docs), "chunks")

#     query = "leetcode"  # replace with something from your PDF
#     results = db.similarity_search(query, k=2)  # top 2 similar chunks
#     print(f"Similarity search for query: '{query}'")
#     for i, r in enumerate(results):
#       print(f"Result {i}:", r.page_content[:300]) 
# # weaviate
#     user_stores[user_id] = vectorstore_path

    user_collections[user_id] = collection_name
    return {"status": "PDF uploaded and processed", "user_id": user_id}

@app.post("/generate/diagram")
async def generate_diagram(req: DiagramRequest):
    # vectorstore_path = user_stores.get(req.user_id, None)
    
    collection_name = user_collections.get(req.user_id, None)
    # PDF is only extra context
    context = ""
    
    if collection_name:
        try:
            # 1. Get the user's collection from the persistent client
            collection = persistent_client.get_collection(
                name=collection_name, embedding_function=embeddings
            )
            
            # 2. Query the collection using the user's prompt
            results = collection.query(
                query_texts=[req.prompt],
                n_results=3
            )
            # The result is a dictionary, extract the documents
            context = "\n".join(results['documents'][0])
        except Exception as e:
            print(f"Error retrieving context for user {req.user_id}: {e}")

    # if vectorstore_path and os.path.exists(vectorstore_path):
    #     # Create a fresh ChromaDB connection each time
    #     vectorstore = Chroma(persist_directory=vectorstore_path, embedding_function=embeddings)
    #     docs = vectorstore.similarity_search(req.prompt, k=3)
    #     context = "\n".join([d.page_content for d in docs])

    template = """
  You are a diagram generator.
Your task is to create flowcharts, system designs, or process diagrams based on the user request. 
Use the extra context if provided.

User request: {user_prompt}

Extra context (optional, may be empty): {context}

Rules:
- Always generate a diagram, even if no extra context is given.
- Return ONLY valid JSON (no text outside JSON).
- JSON must have this exact structure for React Flow:
- Don't add colors or shape in nodes data until specified
- Use light and subtle colors to make it look elegant

{{
  "nodes": [
    {{
      "id": "unique-string",
      "type": "input" | "default" | "output",
      {{
        "label": "string",
        "color": "string (optional)",
        "shape": "string (optional)"
      }},
      "position": {{ "x": number, "y": number }}
    }}
  ],
  "edges": [
    {{
      "id": "unique-string",
      "source": "id-of-source-node",
      "target": "id-of-target-node"
    }}
  ]
}}

Additional guidelines:
- Use "input" type for starting nodes, "output" type for ending nodes, "default" for everything else.
- Position can be a placeholder (e.g., {{ "x": 0, "y": 0 }}) if layout is not known.
- Ensure every edge connects existing nodes.
- Ensure unique IDs for all nodes and edges.
    """

    prompt = ChatPromptTemplate.from_template(template)
    llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0)
    chain = prompt | llm

    try:
        result = await chain.ainvoke({
            "user_prompt": req.prompt,
            "context": context
        })

        raw_text = result.content.strip()
        cleaned = re.sub(r"^```(?:json)?\n|\n```$", "", raw_text.strip())

        try:
            data = json.loads(cleaned)
            # if collection_name:
            #   # Delete the collection, which safely releases the lock
            #   persistent_client.delete_collection(collection_name)
            #   # Remove the mapping from the in-memory store
            #   user_collections.pop(req.user_id, None)
            return {
                "parsed": data,
                "retrieved_context": context
                  }

        except Exception as e:
            return {"raw": raw_text, "error": f"Still invalid JSON: {str(e)}"}

    except Exception as e:
        return {"error": str(e)}
      
      
# @app.delete("/delete-pdf-context/{user_id}")
# async def delete_pdf_context(user_id: str):
    
#     # 1. DETERMINE PHYSICAL PATH (Robust, deterministic)
#     sanitized_user_id = re.sub(r'[^a-zA-Z0-9._-]', '_', user_id)
#     collection_name_derived = f"user-{sanitized_user_id}-docs"
#     collection_path = os.path.join("./vectorstores", collection_name_derived)
    
#     # 2. LOGICAL CLEANUP (Attempt deletion from the persistent client)
#     # Use the derived name for logical deletion
#     try:
#         # Chroma's delete_collection is idempotent (won't fail if the collection doesn't exist)
#         persistent_client.delete_collection(collection_name_derived)
        
#         # 3. CLEAN UP IN-MEMORY ENTRY (if it exists)
#         # Check against the derived name, just in case
#         if user_collections.get(user_id) == collection_name_derived:
#              user_collections.pop(user_id, None)

#     except Exception as e:
#         # Catch any internal Chroma error but proceed to physical cleanup if possible
#         print(f"Chroma logical delete failed for {collection_name_derived}: {e}")
#         # Return an error message but include the attempt to delete the files
#         # We will return this error if physical delete also fails

#     # 4. PHYSICAL CLEANUP (The most important part for file system cleanup)
#     if os.path.exists(collection_path):
#         try:
#             shutil.rmtree(collection_path)
#             print(f"Successfully deleted physical directory: {collection_path}")
#             return {"status": "PDF context and files deleted successfully", "user_id": user_id}
#         except Exception as e:
#             # If directory deletion fails, this is the final error
#             return {"status": "Error", "message": f"Could not delete physical files in {collection_path}: {e}"}
            
#     # 5. Handle "Not Found" case
#     # If the collection wasn't found logically by Chroma AND the directory didn't exist
#     if user_collections.get(user_id):
#         # This case is tricky: in-memory exists, but neither Chroma nor folder exists. Clean up in-memory.
#         user_collections.pop(user_id, None)
        
#     return {"status": "Not Found", "message": f"No active PDF context found for user_id: {user_id}"}


@app.delete("/delete-pdf-context/{user_id}")
async def delete_pdf_context(user_id: str):
    collection_name = user_collections.get(user_id)
    sanitized_user_id = re.sub(r'[^a-zA-Z0-9._-]', '_', user_id)
    collection_dir_name = f"user-{sanitized_user_id}-docs"
    collection_path = os.path.join("./vectorstores", collection_dir_name)
    if collection_name:
        try:
            col = persistent_client.list_collections()
            for c in col:
              print(c.name)
            persistent_client.delete_collection(collection_name)
            persistent_client.list_collections()
            user_collections.pop(user_id, None)
            if os.path.exists(collection_path):
              print("deleted from inmem")
              shutil.rmtree(collection_path)
              print(f"Successfully deleted physical directory: {collection_path}")
            return {"status": "PDF context deleted successfully", "user_id": user_id}
        except Exception as e:
            return {"status": "Error", "message": f"Could not delete collection: {e}"}
    return {"status": "Not Found", "message": f"No active PDF context found for user_id: {user_id}"}









# from fastapi import FastAPI, UploadFile   
# from pydantic import BaseModel            
# from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
# from langchain.output_parsers import StructuredOutputParser, ResponseSchema
# from langchain.prompts import ChatPromptTemplate
# from langchain_community.vectorstores import Chroma
# from langchain.text_splitter import RecursiveCharacterTextSplitter
# from langchain_community.document_loaders import PyPDFLoader
# from langchain_community.document_loaders import PyPDF2Loader
# from io import BytesIO
# import os

# os.environ["GOOGLE_API_KEY"] = "AIzaSyBbhfkyNdxPG-KpnCIPVbtt4-qIBHpFf24"
# app = FastAPI()
# vectorstore = None

# # Save → load → chunk → embed → build Chroma.
# # Populates the global vectorstore.

# @app.post("/upload-pdf")
# async def upload_pdf(file: UploadFile):
#     global vectorstore

#     # Read PDF into memory (not saved to disk)
#     contents = await file.read()
#     pdf_stream = BytesIO(contents)

#     # Load PDF pages from memory
#     loader = PyPDF2Loader(pdf_stream)
#     docs = loader.load()

#     # Split text into chunks
#     splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
#     chunks = splitter.split_documents(docs)

#     # Create embeddings & store in Chroma (temporary in-memory store)
#     embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
#     vectorstore = Chroma.from_documents(chunks, embeddings)

#     return {"status": "PDF indexed", "pages": len(docs)}
  

# class DiagramRequest(BaseModel):
#     prompt: str


# import re
# import json

# @app.post("/generate/diagram")
# async def generate_diagram(req: DiagramRequest):
#     global vectorstore

#     context = ""
#     if vectorstore:
#         docs = vectorstore.similarity_search(req.prompt, k=3)
#         context = "\n".join([d.page_content for d in docs])

#     template = """
#     You are a diagram generator.
#     Convert the following request into a flowchart.

#     User request: {user_prompt}
#     Context: {context}

#     Rules:
#     - Return ONLY valid JSON.
#     - JSON must have:
#         "nodes": [ {{ "id": "string", "label": "string", "type": "input|default|output" }} ],
#         "edges": [ {{ "id": "string", "source": "string", "target": "string" }} ]
#     """

#     prompt = ChatPromptTemplate.from_template(template)

#     llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0)
#     chain = prompt | llm

#     try:
#         result = await chain.ainvoke({
#             "user_prompt": req.prompt,
#             "context": context
#         })

#         raw_text = result.content.strip()

#         # Remove ```json ... ``` wrappers if present
#         cleaned = re.sub(r"^```(?:json)?\n|\n```$", "", raw_text.strip())

#         try:
#             data = json.loads(cleaned)
#             return {"parsed": data}
#         except Exception as e:
#             return {"raw": raw_text, "error": f"Still invalid JSON: {str(e)}"}
#     except Exception as e:
#         return {"error": str(e)}


# @app.post("/generate/diagram")
# async def generate_diagram(req: DiagramRequest):

#   global vectorstore

#   context = ""
#   if vectorstore:
#     docs = vectorstore.similarity_search(req.prompt, k=3)
#     context = "\n".join([d.page_content for d in docs])

#     response_schemas = [
#       ResponseSchema(name="nodes",description="List of nodes with id,label,type"),
#       ResponseSchema(name="edges",description="List of edges with id,source,target")
#     ]

#     parser = StructuredOutputParser.from_response_schemas(response_schemas)
#     format_instructions = parser.get_format_instructions()

#     template = """
#     You are a diagram generator.
#     Convert the following request into a flowchart.

#     User request: {user_prompt}
#     Context: {context}

#     {format_instructions}

#     Rules:
#     - Nodes must have: id (string), label (string), type (input, default, or output).
#     - Edges must have: id (string), source (node id), target (node id).
#     - Return only valid JSON.
#     """

#     prompt = ChatPromptTemplate.from_template(template)

#     llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0)
#     chain = prompt | llm | parser

#     try:
#         parsed = await chain.ainvoke({
#             "user_prompt": req.prompt,
#             "context": context,
#             "format_instructions": format_instructions
#         })

#         # also fetch raw for safety/debugging
#         raw = await (prompt | llm).ainvoke({
#             "user_prompt": req.prompt,
#             "context": context,
#             "format_instructions": format_instructions
#         })

#         return {
#             "parsed": parsed,
#             "raw": raw.content
#         }
#     except Exception as e:
#         return {"error": str(e)}
    

      
