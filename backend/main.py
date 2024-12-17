from fastapi import FastAPI, WebSocket
import asyncio
from pydantic import BaseModel
from typing import List
from datetime import datetime

app = FastAPI()

class RobotData(BaseModel):
    robot_id: str
    online: bool
    battery_percentage: int
    cpu_usage: int
    ram_consumption: int
    last_updated: str
    location: tuple

robots = [ 
    {"robot_id": "robot-1", "online": True, "battery_percentage": 100, "cpu_usage": 20, "ram_consumption": 40, "last_updated": "2024-12-15T12:00:00", "location": (37.7749, -122.4194)},
    {"robot_id": "robot-2", "online": False, "battery_percentage": 15, "cpu_usage": 50, "ram_consumption": 70, "last_updated": "2024-12-15T12:05:00", "location": (34.0522, -118.2437)},
]

@app.get("/robots")
def get_robots():
    return robots

@app.websocket("/ws/robots")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        await asyncio.sleep(5)  # Real-time update every 5 seconds
        data = [RobotData(**robot) for robot in robots]  # Convert each robot dictionary to RobotData model
        for robot in robots:
            robot["last_updated"] = datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S")  # Update timestamp
        await websocket.send_json(data)  # Send the list of RobotData models

