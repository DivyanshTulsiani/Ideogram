import shutil
from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain.prompts import ChatPromptTemplate
from langchain_community.vectorstores import Chroma
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader
from io import BytesIO
import tempfile
import re, json
import os
from langchain_community.vectorstores import FAISS
# import faiss
app = FastAPI()

# ephemeral store per user
user_stores = {}

class DiagramRequest(BaseModel):
    user_id: str
    prompt: str

os.environ["GOOGLE_API_KEY"] = "AIzaSyBbhfkyNdxPG-KpnCIPVbtt4-qIBHpFf24"

embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

@app.post("/upload-pdf/{user_id}")
async def upload_pdf(user_id: str, file: UploadFile = File(...)):
    # Save uploaded PDF to a temporary file
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name

    # Load with PyPDFLoader
    loader = PyPDFLoader(tmp_path)
    documents = loader.load()
    os.remove(tmp_path)


    # Split into chunks
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    docs = text_splitter.split_documents(documents)

    #ye check krene ke liye tha ki docs mai chunks kese jaa rhe the
    # print("Chunks created:", len(docs))
    # for i, doc in enumerate(docs[:3]):
    #   print(f"Chunk {i}:", doc.page_content[:300])

    # Create user-specific vector DB
    vectorstore_path = f"vectorstores/{user_id}"
    db = Chroma.from_documents(docs, embeddings, persist_directory=vectorstore_path)
    db.persist()

    # vectorstore = FAISS.from_documents(docs, embeddings)
    # print("Vectorstore built for user:", user_id, "with", len(docs), "chunks")

    query = "leetcode"  # replace with something from your PDF
    results = db.similarity_search(query, k=2)  # top 2 similar chunks
    print(f"Similarity search for query: '{query}'")
    for i, r in enumerate(results):
      print(f"Result {i}:", r.page_content[:300]) 

    user_stores[user_id] = db



    return {"status": "PDF uploaded and processed", "user_id": user_id}

@app.post("/generate/diagram")
async def generate_diagram(req: DiagramRequest):
    vectorstore = user_stores.get(req.user_id, None)

    # PDF is only extra context
    context = ""
    if vectorstore:
        docs = vectorstore.similarity_search(req.prompt, k=3)
        context = "\n".join([d.page_content for d in docs])

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

{{
  "nodes": [
    {{
      "id": "unique-string",
      "type": "input" | "default" | "output",
      "data": {{ "label": "string" }},
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
            vectorstore_path = f"vectorstores/{req.user_id}"
            if os.path.exists(vectorstore_path):
                shutil.rmtree(vectorstore_path)
            user_stores.pop(req.user_id, None)
            return {
                "parsed": data,
                "retrieved_context": context
                  }

        except Exception as e:
            return {"raw": raw_text, "error": f"Still invalid JSON: {str(e)}"}

    except Exception as e:
        return {"error": str(e)}










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
    

      
