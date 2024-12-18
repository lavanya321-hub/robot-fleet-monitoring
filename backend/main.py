from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from datetime import datetime
import random
import json
import asyncio

app = FastAPI()

# CORS middleware
origins = ["http://localhost:3000"]  # Specify your frontend URL
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Robot schema
class Robot(BaseModel):
    robot_id: str
    online: bool
    battery_percentage: int
    cpu_usage: int
    ram_consumption: int
    last_updated: str
    location: List[float]

# Load robot data from fake_robot_data.json
try:
    with open("fake_robot_data.json", "r") as file:
        robots = json.load(file)
except FileNotFoundError:
    print("Error: fake_robot_data.json not found. Using mock data.")
    robots = [
        {
            "robot_id": "robot1",
            "online": True,
            "battery_percentage": 90,
            "cpu_usage": 30,
            "ram_consumption": 40,
            "last_updated": str(datetime.now()),
            "location": [37.7749, -122.4194],
        },
        {
            "robot_id": "robot2",
            "online": False,
            "battery_percentage": 10,
            "cpu_usage": 70,
            "ram_consumption": 80,
            "last_updated": str(datetime.now()),
            "location": [34.0522, -118.2437],
        },
    ]


# REST API to get robot data
@app.get("/robots")
async def get_robots():
    """Endpoint to fetch all robot data."""
    return robots


# Real-time updates with WebSocket
@app.websocket("/ws/robots")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time robot updates."""
    await websocket.accept()
    while True:
        for robot in robots:
            # Simulate real-time changes
            robot["battery_percentage"] = max(0, robot["battery_percentage"] - random.randint(0, 5))
            robot["cpu_usage"] = random.randint(10, 90)
            robot["ram_consumption"] = random.randint(1000, 8000)
            robot["last_updated"] = str(datetime.now())

            # Change online status randomly
            if random.random() > 0.9:
                robot["online"] = not robot["online"]

        # Send updated data
        await websocket.send_json(robots)
        await asyncio.sleep(5)  # Emit updates every 5 seconds


# Startup event to log backend readiness
@app.on_event("startup")
async def on_startup():
    print("Backend is running and ready to serve requests.")
