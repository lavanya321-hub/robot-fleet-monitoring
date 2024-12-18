import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Import or specify custom icon images
import onlineIconImage from "./path/to/online-icon.png";
import offlineIconImage from "./path/to/offline-icon.png";

// Define custom icons
const onlineIcon = new L.Icon({
    iconUrl: onlineIconImage,
    iconSize: [25, 41], // Adjust size as needed
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    shadowSize: [41, 41],
});

const offlineIcon = new L.Icon({
    iconUrl: offlineIconImage,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    shadowSize: [41, 41],
});

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
        };

        socket.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        socket.onclose = () => {
            console.log("WebSocket disconnected.");
        };

        return () => socket.close(); // Cleanup the WebSocket on component unmount
    }, []);

    const mapCenter = [ 
        robots.length > 0 ? robots[0]["Location Coordinates"][0] : 0, 
        robots.length > 0 ? robots[0]["Location Coordinates"][1] : 0 
    ];

    return (
        <MapContainer center={mapCenter} zoom={5} style={{ height: "500px", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {robots.map((robot) => (
                <Marker
                    key={robot["Robot ID"]}
                    position={robot["Location Coordinates"]}
                    icon={robot["Online/Offline"] ? onlineIcon : offlineIcon} // Assign custom icon based on status
                >
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
