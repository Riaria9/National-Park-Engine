import React from 'react';
import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import SearchPage from './pages/SearchPage';
import FavoritePage from "./pages/FavoritePage";
import ComparePage from "./pages/ComparePage";

function App() {
    return (
        <Routes>
            <Route path="/LoginPage" element={<LoginPage />} />
            <Route path="/SignupPage" element={<SignupPage />} />
            <Route path="/SearchPage" element={<SearchPage />} />
            <Route path="/FavoritePage" element={<FavoritePage />} />
            <Route path="/ComparePage" element={<ComparePage />} />
            <Route path="*" element={<Navigate to="/LoginPage" />} />
        </Routes>
    );
}

export default App;