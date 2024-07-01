import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from './Login/Login';
import DashboardCuisine from './Dashboard/DashboardCuisine'
import DashboardPasse from './Dashboard/DashboardPasse'


function PosRouter() {
    return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}/>
        <Route path="/passe" element={<DashboardPasse />}/>
        <Route path="/cuisine" element={<DashboardCuisine />}/>
      </Routes>
    </BrowserRouter>
    );
}

export default PosRouter;