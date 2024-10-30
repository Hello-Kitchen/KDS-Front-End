import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';

import "./index.css";

import PosRouter from './Pages/PosRouter';

/**
 * @function main
 * @description The main entry point of the React application. It renders the PosRouter component into the root DOM element,
 * which handles all routing for the application.
 * @returns {void}
 */
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <PosRouter />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
