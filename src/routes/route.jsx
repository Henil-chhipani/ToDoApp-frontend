import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from "../pages/home";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}
