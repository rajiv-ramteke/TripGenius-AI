import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

class LLMClient:
    """
    Main AI Client wrapper for NVIDIA NIM API (or any OpenAI compatible endpoint).
    """
    def __init__(self, model_name=None):
        api_key = os.getenv("OPENAI_API_KEY")
        base_url = os.getenv("OPENAI_BASE_URL")
        
        default_model = os.getenv("MODEL_NAME", "meta/llama3-70b-instruct")
        self.model_name = model_name if model_name else default_model

        if not api_key:
            self.client = None
            print("API Key not found. Please set OPENAI_API_KEY in .env")
        else:
            try:
                self.client = OpenAI(
                    api_key=api_key,
                    base_url=base_url if base_url else "https://api.openai.com/v1"
                )
            except Exception as e:
                self.client = None
                print(f"Failed to initialize AI client: {e}")

    def generate(self, prompt: str, temperature: float = 0.7) -> str:
        if not self.client:
            return "Error: AI model is not configured."
            
        try:
            print(f"Sending prompt to LLM ({self.model_name})...")
            response = self.client.chat.completions.create(
                model=self.model_name,
                messages=[{"role": "user", "content": prompt}],
                temperature=temperature,
                max_tokens=2048,
                timeout=60
            )
            print("Received response from LLM.")
            return response.choices[0].message.content
        except Exception as e:
            return f"Error generating content: {e}"
