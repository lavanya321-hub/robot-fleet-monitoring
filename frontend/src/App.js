import React, { useState } from "react";
import RobotMapContainer from "./components/RobotMapContainer";
import "./index.css"; // Import your CSS file for animations

function App() {
    const [showMap, setShowMap] = useState(false); // State to toggle view

    const handleButtonClick = () => {
        setShowMap(true); // Show the map when the button is clicked
    };

    return (
        <div>
            {!showMap ? (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100vh",
                        backgroundImage: `url("/icons/robot1.jpeg")`, // Replace with the correct path
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        color: "blue",
                        textAlign: "center",
                    }}
                >
                    <h1 className="scrolling-heading">Welcome to Robot Fleet Monitoring</h1>
                    <button
                        onClick={handleButtonClick}
                        style={{
                            padding: "10px 20px",
                            fontSize: "1.2rem",
                            fontWeight: "bold",
                            color: "white",
                            backgroundColor: "#007bff",
                            border: "none",
                            borderRadius: "21px",
                            cursor: "pointer",
                            transition: "background-color 0.3s",
                        }}
                    >
                        Get the Dashboard
                    </button>
                </div>
            ) : (
                <div>
                    <div style={{ overflow: "hidden", width: "100%" }}>
                        <h1 className="dashboard-heading">Robot Fleet Monitoring Dashboard</h1>
                    </div>
                    <RobotMapContainer />
                </div>
            )}
        </div>
    );
}

export default App;






/*import React, { useEffect, useState } from 'react';
import { RobotMapContainer } from './components/RobotMapContainer'; 

function App() {
    const [robots, setRobots] = useState([]); // Step 1: Declare state and updater function

    useEffect(() => {
        // Step 2: Fetch data and update robots state
        const fetchData = async () => {
            const response = await fetch('api/robots'); // Replace with your API or data source
            const data = await response.json();
            setRobots(data); // Update state with the fetched data
        };

        fetchData(); // Step 3: Call the fetchData function when component mounts
    }, []); // Step 4: Dependency array - runs only on mount

    return (
        <div>
            <h1>Robot Fleet Monitoring Dashboard</h1>
            <RobotMapContainer robots={robots} /> {/* Pass robots to the component }
        </div>
    );
}

export default App;  */
