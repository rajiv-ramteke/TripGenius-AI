from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database.db import engine, Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="TripGenius AI Backend",
    description="Multi-Agent FastAPI backend for travel planning",
    version="2.0.0"
)

# CORS configuration for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "TripGenius AI Multi-Agent API is running."}

# We will include routers here once we implement them
from .api import destinations, trip

app.include_router(destinations.router, prefix="/api/destinations", tags=["destinations"])
app.include_router(trip.router, prefix="/api/trip", tags=["trip"])
