import React, { useState } from "react";
import RobotMapContainer from "./components/RobotMapContainer";
import "./index.css"; // Ensure this file includes CSS for animations

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
                        animation: "fadeIn 1s", // Fade-in effect
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
                        onMouseEnter={(e) => (e.target.style.backgroundColor = "#0056b3")}
                        onMouseLeave={(e) => (e.target.style.backgroundColor = "#007bff")}
                    >
                        Get the Dashboard
                    </button>
                </div>
            ) : (
                <div>
                    <div style={{ overflow: "hidden", width: "100%", animation: "fadeIn 1s" }}>
                        <h1 className="dashboard-heading">Robot Fleet Monitoring Dashboard</h1>
                    </div>
                    <RobotMapContainer />
                </div>
            )}
        </div>
    );
}

export default App;

/*import React from 'react';
import RobotMapContainer from './components/RobotMapContainer';

function App() {
    return (
        <div>
            <h1>Robot Fleet Monitoring Dashboard</h1>
            <RobotMapContainer />
        </div>
    );
}

export default App;*/