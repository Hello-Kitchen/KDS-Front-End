import {React, useState} from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from './Login/Login';
import DashboardCuisine from './Dashboard/DashboardCuisine';
import DashboardPasse from './Dashboard/DashboardPasse';


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