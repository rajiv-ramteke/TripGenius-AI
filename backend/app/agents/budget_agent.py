import json
from ..ai.llm_client import LLMClient

class BudgetAgent:
    def __init__(self):
        self.llm = LLMClient()

    def estimate_budget(self, destination: str, duration: int, travel_style: str):
        prompt = f"""
        You are a financial AI agent specializing in travel.
        Estimate the total budget and breakdown for a {duration}-day trip to {destination}.
        The user's travel style is: {travel_style}.
        
        Return ONLY a valid JSON object in this format:
        {{
          "currency": "USD",
          "total_estimated": 1500,
          "breakdown": {{
             "accommodation": 500,
             "food": 300,
             "transportation": 200,
             "activities": 400,
             "miscellaneous": 100
          }},
          "money_saving_tips": ["Tip 1", "Tip 2"]
        }}
        """
        response = self.llm.generate(prompt)
        try:
            cleaned = response.replace("```json", "").replace("```", "").strip()
            return json.loads(cleaned)
        except Exception as e:
            print(f"Failed to parse JSON from Budget Agent: {e}")
            return {"error": "Failed to calculate budget"}
