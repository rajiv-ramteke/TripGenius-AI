from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ..agents.destination_agent import DestinationAgent

router = APIRouter()
agent = DestinationAgent()

class DestinationRequest(BaseModel):
    budget: str
    duration: int
    travel_style: str
    mood: str
    preferred_state: str = "Anywhere in India"

@router.post("/recommend")
async def recommend_destinations(req: DestinationRequest):
    try:
        recommendations = agent.get_recommendations(
            budget=req.budget,
            duration=req.duration,
            travel_style=req.travel_style,
            mood=req.mood,
            preferred_state=req.preferred_state
        )
        return {"status": "success", "data": recommendations}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
