import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import { processStockData } from "../utils";
import { URLs } from "../URLs";

const StockDataContext = createContext();

export const useStockData = () => useContext(StockDataContext);

const handleFetchStockDetails = async (url) => {
    const response = await axios.get(url, {
        headers: { "User-Agent": "request" },
    });
    return response
}

const TIMESERIESKEYS = {
    '1d': 'TIME_SERIES_INTRADAY',
    '3d': 'TIME_SERIES_DAILY',
    '1w': 'TIME_SERIES_DAILY',
    '1m': 'TIME_SERIES_WEEKLY',
    '1y': 'TIME_SERIES_MONTHLY'
};

const StockDataProvider = ({ children }) => {
    const [stockData, setStockData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async (interval) => {
        const url = URLs.STOCK_DETAILS.replace('{interval}', TIMESERIESKEYS[interval])

        if (localStorage.getItem(url)) {
            const cachedData = JSON.parse(localStorage.getItem(url));
            const processedData = processStockData(cachedData, interval);
            setStockData(processedData);

            return;
        }

        try {
            setLoading(true);
            const response = await handleFetchStockDetails(url)

            if (response.status === 200) {
                const rawData = response.data;

                localStorage.setItem(url, JSON.stringify(rawData));

                const processedData = processStockData(rawData);
                setStockData(processedData);
            } else {
                console.log("Status:", response.status);
            }
        } catch (error) {
            console.error("Error:", error.message);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <StockDataContext.Provider
            value={{ stockData, fetchData, loading, error }}
        >
            {children}
        </StockDataContext.Provider>
    );
};

export default StockDataProvider;
