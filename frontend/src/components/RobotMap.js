import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const RobotMap = () => {
    const [robots, setRobots] = useState([]); // State to hold robots data

    // Fetch robots data from the API when the component mounts
    useEffect(() => {
        fetch("http://localhost:8000/robots")
            .then((response) => response.json())
            .then((data) => {
                console.log("Fetched robots data:", data);
                setRobots(data); // Update the state with API data
            })
            .catch((error) => console.error("Error fetching robots data:", error));
    }, []);

    // WebSocket to get real-time updates
    useEffect(() => {
        const socket = new WebSocket("ws://localhost:8000/ws/robots");

        socket.onopen = () => {
            console.log("WebSocket connected.");
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data); // Parse incoming data
            console.log("WebSocket data received:", data);
            setRobots(data); // Update the state with WebSocket data
            console.log("Updated robots state:", data); 
        };

        socket.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        socket.onclose = () => {
            console.log("WebSocket disconnected.");
        };

        return () => socket.close(); // Cleanup the WebSocket on component unmount
    }, []);

    return (
        <MapContainer center={[0, 0]} zoom={2} style={{ height: "500px", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {robots.map((robot) => (
                <Marker key={robot["Robot ID"]} position={robot["Location Coordinates"]}>
                    <Popup>
                        <strong>ID:</strong> {robot["Robot ID"]}
                        <br />
                        <strong>Status:</strong> {robot["Online/Offline"] ? "Online" : "Offline"}
                        <br />
                        <strong>Battery:</strong> {robot["Battery Percentage"]}%
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

RobotMap.propTypes = {
    robots: PropTypes.arrayOf(
        PropTypes.shape({
            "Robot ID": PropTypes.string.isRequired,
            "Online/Offline": PropTypes.bool.isRequired,
            "Battery Percentage": PropTypes.number.isRequired,
            "CPU Usage": PropTypes.number.isRequired,
            "RAM Consumption": PropTypes.number.isRequired,
            "Last Updated": PropTypes.string.isRequired,
            "Location Coordinates": PropTypes.arrayOf(PropTypes.number).isRequired,
        })
    ),
};

export default RobotMap;