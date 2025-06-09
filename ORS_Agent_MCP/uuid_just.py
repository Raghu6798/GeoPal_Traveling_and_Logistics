from langchain_mistralai import ChatMistralAI
from dotenv import load_dotenv
import os 
load_dotenv()


MISTRAL_API_KEY= os.getenv("MISTRAL_API_KEY")
model = ChatMistralAI(
        model="mistral-medium-2505",
        api_key=MISTRAL_API_KEY
)
response = model.invoke("Hey what is up")
print(response.content)