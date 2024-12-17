import React, { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css"; // Core Leaflet styles
import "leaflet.markercluster/dist/MarkerCluster.css"; // MarkerCluster styles
import "leaflet.markercluster/dist/MarkerCluster.Default.css"; // MarkerCluster Default styles
import "leaflet.markercluster/dist/leaflet.markercluster.js"; // MarkerCluster script

const RobotMapContainer = () => {
    const [robots, setRobots] = useState([]);

    // Fetch robot data from the backend
    useEffect(() => {
        fetch("http://127.0.0.1:8000/robots")
            .then((response) => response.json())
            .then((data) => setRobots(data))
            .catch((error) => console.error("Error fetching robots data:", error));
    }, []);

    useEffect(() => {
        if (!L.map || robots.length === 0) return;

        // Initialize the Leaflet map
        const map = L.map("map").setView([0, 0], 2);

        // Add OpenStreetMap tile layer
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; OpenStreetMap contributors",
        }).addTo(map);

        // Initialize marker cluster group
        const markers = L.markerClusterGroup();

        // Define custom icons
        const onlineIcon = L.icon({
            iconUrl: "/icons/online-icon.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [0, -30],
        });

        const offlineIcon = L.icon({
            iconUrl: "/icons/offline-icon.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [0, -30],
        });

        const lowBatteryIcon = L.icon({
            iconUrl: "/icons/robot-icon.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [0, -30],
        });

        // Add markers for each robot
        robots.forEach((robot) => {
            const { location, "Robot ID": id, "Online/Offline": online, "Battery Percentage": battery } = robot;

            if (location && location.length === 2) {
                const icon = !online
                    ? offlineIcon
                    : battery < 20
                    ? lowBatteryIcon
                    : onlineIcon;

                const marker = L.marker(location, { icon });

                // Bind a popup with robot details
                marker.bindPopup(
                    `<strong>ID:</strong> ${id}<br>
                     <strong>Status:</strong> ${online ? "Online" : "Offline"}<br>
                     <strong>Battery:</strong> ${battery}%`
                );

                markers.addLayer(marker);
            }
        });

        // Add marker cluster group to the map
        map.addLayer(markers);

        // Cleanup map instance on component unmount
        return () => {
            map.remove();
        };
    }, [robots]);

    return <div id="map" style={{ height: "500px", width: "100%" }}></div>;
};

export default RobotMapContainer;

/*import React, { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css"; // For Leaflet core CSS
import "leaflet.markercluster/dist/MarkerCluster.css"; // Correct path for MarkerCluster CSS
import "leaflet.markercluster/dist/MarkerCluster.Default.css"; // For MarkerCluster Default CSS
import "leaflet.markercluster/dist/leaflet.markercluster.js"; // JS file for clustering


const RobotMapContainer = () => {
    const [robots, setRobots] = useState([]);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/robots")
            .then((response) => response.json())
            .then((data) => setRobots(data))
            .catch((error) => console.error("Error fetching robots data:", error));
    }, []);
    
    

    useEffect(() => {
        if (!L.map || robots.length === 0) return;
    
        console.log("Rendering markers for robots:", robots);
    
        const map = L.map("map").setView([0, 0], 2);
    
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; OpenStreetMap contributors",
        }).addTo(map);
    
        const markers = L.markerClusterGroup();
    
        robots.forEach((robot) => {
            console.log("Processing robot:", robot); // Log each robot
    
            if (robot["Location Coordinates"] && robot["Location Coordinates"].length === 2) {
                const marker = L.marker(robot["Location Coordinates"], {
                    icon: L.icon({
                        iconUrl: robot["Online/Offline"]
                            ? "/icons/online-icon.png"
                            : "/icons/offline-icon.png",
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [0, -30],
                    }),
                });
    
                marker.bindPopup(
                    `<strong>ID:</strong> ${robot["Robot ID"]}<br>
                     <strong>Status:</strong> ${robot["Online/Offline"] ? "Online" : "Offline"}<br>
                     <strong>Battery:</strong> ${robot["Battery Percentage"]}%`
                );
    
                markers.addLayer(marker);
            } else {
                console.error("Invalid robot data:", robot);
            }
        });
    
        map.addLayer(markers);
    
        return () => {
            map.remove();
        };
    }, [robots]);
    

    return <div id="map" style={{ height: "500px", width: "100%" }}></div>;
};

export default RobotMapContainer;*/
