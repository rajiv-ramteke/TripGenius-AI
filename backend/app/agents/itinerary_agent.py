import json
from ..ai.llm_client import LLMClient

class ItineraryAgent:
    def __init__(self):
        self.llm = LLMClient()

    def generate_itinerary(self, destination: str, duration: int, travel_style: str):
        prompt = f"""
        You are an expert Indian travel itinerary planning AI, specializing in budget-friendly trips for Gramin (village) citizens.
        Create a detailed {duration}-day itinerary for a trip to {destination} in India.
        The travel style is: {travel_style}.
        Focus on culturally rich, accessible, and affordable activities and stays.

        Return ONLY a valid JSON object in this exact format, no markdown:
        {{
          "destination": "{destination}",
          "days": [
            {{
              "day": 1,
              "theme": "Theme for the day",
              "activities": [
                 {{"time": "Morning", "activity": "Specific activity description", "location": "Exact place name"}},
                 {{"time": "Afternoon", "activity": "Specific activity description", "location": "Exact place name"}},
                 {{"time": "Evening", "activity": "Specific activity description", "location": "Exact place name"}}
              ]
            }}
          ],
          "hotel_suggestions": [
            {{
              "name": "Budget Hotel or Dharamshala name",
              "price_per_night": "Price in INR per night (number only)",
              "type": "Hotel / Dharamshala / Guesthouse"
            }}
          ],
          "places_to_visit": [
            {{
              "name": "Famous place name",
              "description": "Short description of why to visit this place"
            }}
          ]
        }}
        """
        response = self.llm.generate(prompt)
        try:
            cleaned = response.replace("```json", "").replace("```", "").strip()
            return json.loads(cleaned)
        except Exception as e:
            print(f"Failed to parse JSON from Itinerary Agent: {e}")
            return {"error": "Failed to generate itinerary", "raw": response}
