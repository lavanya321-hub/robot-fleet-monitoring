import React from 'react';
import { createRoot } from "react-dom/client"; // Correct import for React 18+
import './index.css';  // Import your global styles
import App from './App';  // Import the main App component

// Get the root element from index.html
const rootElement = document.getElementById("root");

// Create the React root and render the App component
const root = createRoot(rootElement);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

/*const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);*/

/*ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);*/
