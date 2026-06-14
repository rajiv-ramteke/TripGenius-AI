from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ..agents.itinerary_agent import ItineraryAgent
from ..agents.budget_agent import BudgetAgent
from ..agents.weather_agent import WeatherAgent

router = APIRouter()
itinerary_agent = ItineraryAgent()
budget_agent = BudgetAgent()
weather_agent = WeatherAgent()

class TripRequest(BaseModel):
    destination: str
    duration: int
    travel_style: str

@router.post("/generate-itinerary")
async def generate_itinerary(req: TripRequest):
    try:
        data = itinerary_agent.generate_itinerary(
            destination=req.destination,
            duration=req.duration,
            travel_style=req.travel_style
        )
        return {"status": "success", "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/estimate-budget")
async def estimate_budget(req: TripRequest):
    try:
        data = budget_agent.estimate_budget(
            destination=req.destination,
            duration=req.duration,
            travel_style=req.travel_style
        )
        return {"status": "success", "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/weather")
async def get_weather(req: TripRequest):
    try:
        data = weather_agent.get_weather(destination=req.destination)
        return {"status": "success", "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
