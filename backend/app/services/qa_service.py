from langchain.chains import RetrievalQA
from langchain.chat_models import ChatOpenAI
from langchain.prompts import PromptTemplate
from app.services.embedding_service import get_vector_db
from app.config import OPENAI_API_KEY
from app.constants.prompts import CUSTOMER_SUPPORT_PROMPT, SALES_ASSISTANT_PROMPT, TECHNICAL_SUPPORT_PROMPT, HEALTHCARE_ASSISTANT_PROMPT, LEGAL_ASSISTANT_PROMPT, EDUCATIONAL_TUTOR_PROMPT, HR_ASSISTANT_PROMPT, FINANCIAL_ADVISOR_PROMPT, TRAVEL_ASSISTANT_PROMPT, GENERAL_PURPOSE_PROMPT

CHAR_LIMIT = 500

def get_prompt(prompt_type: str, custom_prompt: str = ""):
    prompt_template = ""
    if custom_prompt:
        prompt_template = custom_prompt
    else:
        if prompt_type == "Customer Support":
            prompt_template = CUSTOMER_SUPPORT_PROMPT
        elif prompt_type == "Sales Assistant":
            prompt_template = SALES_ASSISTANT_PROMPT
        elif prompt_type == "Technical Support":
            prompt_template = TECHNICAL_SUPPORT_PROMPT
        elif prompt_type == "Healthcare Assistant":
            prompt_template = HEALTHCARE_ASSISTANT_PROMPT
        elif prompt_type == "Legal Assistant":
            prompt_template = LEGAL_ASSISTANT_PROMPT
        elif prompt_type == "Educational Tutor":
            prompt_template = EDUCATIONAL_TUTOR_PROMPT
        elif prompt_type == "HR Assistant":
            prompt_template = HR_ASSISTANT_PROMPT
        elif prompt_type == "Financial Advisor":
            prompt_template = FINANCIAL_ADVISOR_PROMPT
        elif prompt_type == "Travel Assistant":
            prompt_template = TRAVEL_ASSISTANT_PROMPT
        else:
            prompt_template = GENERAL_PURPOSE_PROMPT

    final_instructions = """
    IMPORTANT INSTRUCTIONS:
    1. Base your response ONLY on the information provided in the context above.
    2. If the context does not contain relevant information to answer the question, respond with: "I apologize, but I don't have enough information in my knowledge base to answer this question accurately."
    3. Do not make up or infer information that is not explicitly present in the context.
    4. Keep your response focused on the information found in the provided documents.
    5. If the question is not related to the context, respond with: "I apologize, but I don't have enough information in my knowledge base to answer this question accurately."
    6. If the question is not clear, ask for clarification.
    7. If the question is not related to the context, respond with: "I apologize, but I don't have enough information in my knowledge base to answer this question accurately."
    8. If the question is not related to the context, respond with: "I apologize, but I don't have enough information in my knowledge base to answer this question accurately."
    9. If the question is not related to the context, respond with: "I apologize, but I don't have enough information in my knowledge base to answer this question accurately."
    10. If the question is not related to the context, respond with: "I apologize, but I don't have enough information in my knowledge base to answer this question accurately."
    """

    return PromptTemplate.from_template(
        prompt_template + "\n\n"
        "Context:\n{context}\n\n"
        "Question:\n{question}\n\n"
        f"{final_instructions}\n\n"
        "Answer:"
    )

def answer_query(query: str, doc_ids: list[str] = None, prompt_type: str = "", custom_prompt: str = ""):
    prompt_template = get_prompt(prompt_type, custom_prompt)

    filter_kwargs = {"k": 3}
    if doc_ids:
        filter_kwargs["filter"] = {"doc_id": {"$in": doc_ids}}

    qa = RetrievalQA.from_chain_type(
        llm=ChatOpenAI(openai_api_key=OPENAI_API_KEY),
        chain_type="stuff",
        retriever=get_vector_db().as_retriever(search_kwargs=filter_kwargs),
        return_source_documents=True,
        chain_type_kwargs={
            "prompt": prompt_template.partial(char_limit=str(CHAR_LIMIT))
        }
    )

    result = qa(query)
    return {"answer": result['result']}