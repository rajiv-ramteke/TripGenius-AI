import sys
import os
import re
import json

sys.path.append('.')
from app.ai.llm_client import LLMClient

client = LLMClient()
prompt = """
You are a highly experienced travel advisor AI specifically catering to Indian tourists, especially village citizens (Gramin / Rural travelers) looking for affordable travel.
CRITICAL RULE: You must ONLY recommend destinations located completely WITHIN INDIA. Focus heavily on recommending Indian States and specific local places in those states.
Do NOT recommend any international destinations.
The travel plans must be budget-conscious, practical, culturally rich, and friendly for local Indian village travelers.

Based on these parameters:
- Budget: Sasta (Budget-Friendly) (Assume Indian Rupees INR, keep it very affordable for village citizens)
- Duration: 5 days
- Travel Style: Explorer
- Current Mood: Relaxing
- Preferred State: Anywhere in India

Recommend 3 perfect destinations. Return ONLY a valid JSON array, no markdown or text outside it.
Format:
[
  {
    "destination": "Specific City/Town Name",
    "state": "Indian State Name",
    "reason": "Why this matches the user's mood and style, explained simply for a village citizen",
    "estimated_cost_inr": "Total cost in rupees (number only)",
    "highlights": ["highlight 1", "highlight 2"],
    "hotel_suggestions": [
      {
        "name": "Name of budget hotel or Dharamshala",
        "price_per_night": "Estimated price per night in INR"
      }
    ]
  }
]
"""
print("Generating...")
response = client.generate(prompt)
print("---RAW RESPONSE---")
print(response)
print("------------------")

match = re.search(r'\[.*\]', response, re.DOTALL)
if match:
    try:
        data = json.loads(match.group(0))
        print("SUCCESS! Parsed JSON:")
        print(json.dumps(data, indent=2))
    except Exception as e:
        print("JSON parse failed!", e)
else:
    print("Regex failed to find array!")
