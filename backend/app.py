from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from datetime import datetime
import random
import asyncio
import json

app = FastAPI()

# Robot schema
class Robot(BaseModel):
    robot_id: str
    online: bool
    battery_percentage: int
    cpu_usage: int
    ram_consumption: int
    last_updated: str
    location: List[float]  # Correctly define location as a list of floats

# Load robots from fake_robot_data.json
with open("fake_robot_data.json") as f:
    robots = json.load(f)

# CORS middleware
origins = ["http://localhost:3000"]  # Specify your frontend URL
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# WebSocket connection to send real-time updates
@app.websocket("/ws/robots")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        await asyncio.sleep(5)  # Emit every 5 seconds
        data = []
        for robot in robots:
            # Simulate random status updates
            robot["online"] = random.choice([True, False])
            robot["battery_percentage"] = random.randint(0, 100)
            robot["cpu_usage"] = random.randint(0, 100)
            robot["ram_consumption"] = random.randint(0, 100)
            robot["last_updated"] = str(datetime.now())

            # Only send necessary fields
            data.append({
                "robot_id": robot["robot_id"],
                "online": robot["online"],
                "battery_percentage": robot["battery_percentage"],
                "cpu_usage": robot["cpu_usage"],
                "ram_consumption": robot["ram_consumption"],
                "last_updated": robot["last_updated"],
                "location": robot["location"],  # Ensure location is correctly serialized
            })

        await websocket.send_json(data)  # Send data as a list of plain objects



@app.get("/robots")
async def get_robots():
    return robots
