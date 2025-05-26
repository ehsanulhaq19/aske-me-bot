from langchain.chains import RetrievalQA
from langchain.chat_models import ChatOpenAI
from langchain.prompts import PromptTemplate
from app.services.embedding_service import get_vector_db
from app.config import OPENAI_API_KEY

CHAR_LIMIT = 500

prompt_template = PromptTemplate.from_template(
    "You are a helpful assistant. Answer the question based only on the context provided, and keep your response under {char_limit} characters.\n\n"
    "Context:\n{context}\n\n"
    "Question:\n{question}\n\n"
    "Answer:"
)

qa = RetrievalQA.from_chain_type(
    llm=ChatOpenAI(openai_api_key=OPENAI_API_KEY),
    chain_type="stuff",
    retriever=get_vector_db().as_retriever(search_kwargs={"k": 3}),
    return_source_documents=True,
    chain_type_kwargs={
        "prompt": prompt_template.partial(char_limit=str(CHAR_LIMIT))
    }
)

def answer_query(query: str):
    result = qa(query)
    return {"answer": result['result']}