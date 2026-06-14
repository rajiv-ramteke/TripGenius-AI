import json
from ..ai.llm_client import LLMClient

class WeatherAgent:
    def __init__(self):
        self.llm = LLMClient()

    def get_weather(self, destination: str):
        prompt = f"""
        You are a weather and packing intelligence AI agent specializing in Indian travel.
        Provide the typical seasonal weather, temperature, and packing suggestions for a trip to {destination}.
        Keep suggestions practical for an Indian village citizen (Gramin traveler).
        
        Return ONLY a valid JSON object in this format:
        {{
          "season": "Summer / Winter / Monsoon etc.",
          "temperature_range": "e.g., 20°C - 35°C",
          "description": "Brief description of the expected weather",
          "packing_suggestions": ["Suggestion 1", "Suggestion 2", "Suggestion 3"]
        }}
        """
        response = self.llm.generate(prompt)
        try:
            # Extract JSON from potential markdown wrappers
            import re
            match = re.search(r'\{.*\}', response, re.DOTALL)
            if match:
                return json.loads(match.group(0))
            else:
                return {"error": "Failed to parse weather data"}
        except Exception as e:
            print(f"Failed to parse JSON from Weather Agent: {e}")
            return {"error": "Failed to get weather intelligence"}
