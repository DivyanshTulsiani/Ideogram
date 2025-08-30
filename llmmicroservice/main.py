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

@app.post("/generate/diagram")
async def generate_diagram(req: DiagramRequest):

  global vectorstore

  context = ""
  if vectorstore:
    docs = vectorstore.similarity_search(req.prompt, k=3)
    context = "\n".join([d.page_content for d in docs])
    