import React, { useEffect, useState, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Define custom icon for online and offline robots
const getIcon = (status, battery) => {
    let iconUrl = "";
    if (status) {
        // Online robots - Green icon
        iconUrl = "/icons/online-icon.png"; // Replace with your online icon path
    } else {
        // Offline robots - Red icon
        iconUrl = "/icons/offline-icon.png"; // Replace with your offline icon path
    }

    return L.icon({
        iconUrl,
        iconSize: [25, 41], // Size of the icon
        iconAnchor: [12, 41], // Point of the icon that will correspond to marker's location
    });
};

const RobotMapContainer = () => {
    const [robots, setRobots] = useState([]); // State to hold robot data
    const mapRef = useRef(null); // Ref to hold Leaflet map instance

    useEffect(() => {
        // Fetch robots data initially
        fetch("http://localhost:8000/robots")
            .then((response) => response.json())
            .then((data) => setRobots(data))
            .catch((error) => console.error("Error fetching robots data:", error));
    }, []);

    useEffect(() => {
        // Setup WebSocket for real-time updates
        const socket = new WebSocket("wss://localhost:8000/ws/robots");

        socket.onopen = () => {
            console.log("WebSocket connected.");
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data); // Parse incoming data
            console.log("WebSocket data received:", data);
            setRobots(data); // Update the robots state
        };

        socket.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        socket.onclose = () => {
            console.log("WebSocket disconnected.");
        };

        return () => socket.close(); // Cleanup WebSocket on component unmount
    }, []);

    useEffect(() => {
        if (!mapRef.current) {
            // Initialize the map only once
            mapRef.current = L.map("map").setView([0, 0], 2);

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: "&copy; OpenStreetMap contributors",
            }).addTo(mapRef.current);
        }

        // Clear existing markers
        mapRef.current.eachLayer((layer) => {
            if (layer instanceof L.Marker) {
                mapRef.current.removeLayer(layer);
            }
        });

        // Add markers for robots
        robots.forEach((robot) => {
            const {
                "Robot ID": id,
                "Location Coordinates": coordinates,
                "Online/Offline": status,
                "Battery Percentage": battery,
            } = robot;

            if (coordinates && coordinates.length === 2) {
                L.marker(coordinates, { icon: getIcon(status, battery) })
                    .addTo(mapRef.current)
                    .bindPopup(`
                        <strong>ID:</strong> ${id}<br>
                        <strong>Status:</strong> ${status ? "Online" : "Offline"}<br>
                        <strong>Battery:</strong> ${battery}%
                    `);
            }
        });
    }, [robots]);

    return <div id="map" style={{ height: "500px", width: "100%" }}></div>;
};

export default RobotMapContainer;
