ROBOT FLEET MONITORING DASHBOARD

Overview
The Robot Fleet Monitoring System is a FastAPI-based web application designed to monitor and display the status of robots in a fleet. It provides real-time information such as the battery percentage, CPU usage, RAM consumption, and location coordinates of each robot via a WebSocket connection.

![Screenshot 2024-12-18 202729](https://github.com/user-attachments/assets/e6310bd5-f5bc-43ed-b6f5-e7c6c1be62a6)

Features
Real-time monitoring of robot data.

WebSocket integration for real-time updates.

CORS middleware to enable cross-origin requests.

JSON-based robot data storage.

Secure HTTPS communication using SSL certificates.

Prerequisites

Before you begin, ensure you have the following installed:

Python (version 3.11+)

FastAPI: A web framework to build APIs.

Uvicorn: An ASGI server to run FastAPI applications.

SSL certificates: Necessary for secure communication.


![Screenshot 2024-12-18 204036](https://github.com/user-attachments/assets/3d1bf9ac-77d6-49bc-8c1c-53dab6588c35)

![Screenshot 2024-12-18 204250](https://github.com/user-attachments/assets/cb895a26-78d9-4a0a-85c0-210a061ab16a)

Installation
Clone the repository:

git clone https://github.com/your-username/robot-fleet-monitoring.git

cd robot-fleet-monitoring/backend

Create and activate a virtual environment:

bash
python -m venv env
source env/bin/activate  # For Windows use `env\Scripts\activate`
Install the dependencies:

bash
pip install -r requirements.txt
Place SSL certificates:

bash
# Ensure that your SSL certificates are placed at C:/certs/
# Ensure 'key.pem' and 'cert.pem' exist
Run the application:

bash
python app.py
Configuration
SSL Configuration: Update the SSL key and certificate paths in app.py if necessary.

'''python
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, ssl_keyfile="C:/certs/key.pem", ssl_certfile="C:/certs/cert.pem")
Robot Data File: Ensure that the robot_data.json file exists in C:/data/robot_data.json or update the path accordingly.

WebSocket Endpoint
The application provides a WebSocket endpoint at /ws/robots for real-time updates.

python

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import json
import uvicorn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.websocket("/ws/robots")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            await websocket.send_text(json.dumps(robots))  # Send robots' data in JSON format
    except WebSocketDisconnect:
        print("Client disconnected")
Robot Data Format
The robot data is expected to be in the following format in robot_data.json:

json
[
  {
    "Robot ID": "63e06a27-8fb5-49b6-afdd-555d6a01f131",
    "Online/Offline": false,
    "Battery Percentage": 40,
    "CPU Usage": 25,
    "RAM Consumption": 5514,
    "Last Updated": "2024-12-11 11:19:51",
    "Location Coordinates": [34.946804, -1.265231]
  },
  {
    "Robot ID": "fbe83522-ea53-4869-97cb-d8cb40007f83",
    "Online/Offline": false,
    "Battery Percentage": 59,
    "CPU Usage": 77,
    "RAM Consumption": 6243,
    "Last Updated": "2024-12-11 10:50:10",
    "Location Coordinates": [13.700687, -50.895561]
  }
]

Troubleshooting
FileNotFoundError: Ensure the robot_data.json file exists at the specified location.
WebSocket Errors: Ensure the WebSocket server is running, and there are no CORS-related issues.
SSL Certificates: Verify the key.pem and cert.pem files are placed correctly.
Contributing
Contributions are welcome! If you find any issues or would like to enhance the project, feel free to submit a pull request.

License
This project is licensed under the MIT License.
