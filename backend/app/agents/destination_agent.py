import json
from ..ai.llm_client import LLMClient

class DestinationAgent:
    def __init__(self):
        self.llm = LLMClient()

    def get_recommendations(self, budget: str, duration: int, travel_style: str, mood: str, preferred_state: str = "Anywhere in India"):
        state_instruction = f"CRITICAL RULE: You MUST ONLY recommend destinations located completely WITHIN the state of {preferred_state}." if preferred_state and preferred_state != "Anywhere in India" else "CRITICAL RULE: You must ONLY recommend destinations located completely WITHIN INDIA. Focus heavily on recommending Indian States and specific local places in those states."
        
        prompt = f"""
        You are a highly experienced travel advisor AI specifically catering to Indian tourists, especially village citizens (Gramin / Rural travelers) looking for affordable travel.
        {state_instruction}
        Do NOT recommend any international destinations.
        The travel plans must be budget-conscious, practical, culturally rich, and friendly for local Indian village travelers.
        
        Based on these parameters:
        - Budget: {budget} (Assume Indian Rupees INR, keep it very affordable for village citizens)
        - Duration: {duration} days
        - Travel Style: {travel_style}
        - Current Mood: {mood}
        - Preferred State: {preferred_state}

        Recommend 3 perfect destinations. Return ONLY a valid JSON array, no markdown or text outside it.
        Format:
        [
          {{
            "destination": "Specific City/Town Name",
            "state": "Indian State Name",
            "reason": "Why this matches the user's mood and style, explained simply for a village citizen",
            "estimated_cost_inr": "Total cost in rupees (number only)",
            "highlights": ["highlight 1", "highlight 2"],
            "hotel_suggestions": [
              {{
                "name": "Name of budget hotel or Dharamshala",
                "price_per_night": "Estimated price per night in INR"
              }}
            ]
          }}
        ]
        """
        response = self.llm.generate(prompt)
        try:
            import re
            # Extract JSON array using regex
            match = re.search(r'\[.*\]', response, re.DOTALL)
            if match:
                return json.loads(match.group(0))
            else:
                print("Could not find JSON array in response:", response)
                return []
        except Exception as e:
            print(f"Failed to parse JSON from Destination Agent: {e}\nResponse: {response}")
            return []
