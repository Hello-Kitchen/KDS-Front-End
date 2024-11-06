import {React, useState} from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from './Login/Login';
import DashboardCuisine from './Dashboard/DashboardCuisine';
import DashboardPasse from './Dashboard/DashboardPasse';

/**
 * @function PosRouter
 * @description Main router component that sets up the application routing using React Router.
 * It defines routes for the login and dashboard components.
 * @returns {JSX.Element} The router component containing application routes.
 */
function PosRouter() {
  const [config, setConfig] = useState({enable: false});

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/passe" element={<DashboardPasse />} />
        <Route path="/cuisine" element={<DashboardCuisine config={config} setConfig={setConfig} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default PosRouter;
