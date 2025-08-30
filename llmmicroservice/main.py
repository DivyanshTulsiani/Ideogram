from fastapi import FastAPI, UploadFile   
from pydantic import BaseModel            
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain.output_parsers import StructuredOutputParser, ResponseSchema
from langchain.prompts import ChatPromptTemplate
from langchain_community.vectorstores import Chroma
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader
import os

os.environ["GOOGLE_API_KEY"] = "AIzaSyBbhfkyNdxPG-KpnCIPVbtt4-qIBHpFf24"
app = FastAPI()
vectorstore = None

@app.post("/upload-pdf")
async def upload_pdf(file: UploadFile):
  global vectorstore

  with open(file.filename, "wb") as f:
    f.write(await file.read())

    # //this loads the pdf into langchain
    loader = PyPDFLoader(file.filename)
    docs = loader.load()

    splitter = RecursiveCharacterTextSplitter(chunk_size = 1000, chunk_overlap=100)
    chunks = splitter.split_documents(docs)

    #this will create embeddings
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    vectorstore = Chroma.from_documents(chunks,embeddings)

    return {"status": "PDF indexed", "pages": len(docs)}
  

class DiagramRequest(BaseModel):
    prompt: str


import re
import json

@app.post("/generate/diagram")
async def generate_diagram(req: DiagramRequest):
    global vectorstore

    context = ""
    if vectorstore:
        docs = vectorstore.similarity_search(req.prompt, k=3)
        context = "\n".join([d.page_content for d in docs])

    template = """
    You are a diagram generator.
    Convert the following request into a flowchart.

    User request: {user_prompt}
    Context: {context}

    Rules:
    - Return ONLY valid JSON.
    - JSON must have:
        "nodes": [ {{ "id": "string", "label": "string", "type": "input|default|output" }} ],
        "edges": [ {{ "id": "string", "source": "string", "target": "string" }} ]
    """

    prompt = ChatPromptTemplate.from_template(template)

    llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0)
    chain = prompt | llm

    try:
        result = await chain.ainvoke({
            "user_prompt": req.prompt,
            "context": context
        })

        raw_text = result.content.strip()

        # Remove ```json ... ``` wrappers if present
        cleaned = re.sub(r"^```(?:json)?\n|\n```$", "", raw_text.strip())

        try:
            data = json.loads(cleaned)
            return {"parsed": data}
        except Exception as e:
            return {"raw": raw_text, "error": f"Still invalid JSON: {str(e)}"}
    except Exception as e:
        return {"error": str(e)}


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
    

      
