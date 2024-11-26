import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LineChart from "../components/LineChart/LineChart";
import StockChart from "../components/LineChart";
import Summary from "../components/LineChart/Summary";
import Statistics from "../components/LineChart/Statistics";
import Analytics from "../components/LineChart/Analytics";
import Settings from "../components/LineChart/Settings";

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<StockChart />}>
                    <Route index element={<Summary />} />
                    <Route path="charts" element={<LineChart />} />
                    <Route path="summary" element={<Summary />} />
                    <Route path="statistics" element={<Statistics />} />
                    <Route path="analytics" element={<Analytics />} />
                    <Route path="settings" element={<Settings />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default AppRoutes;
