import React, { createContext, useContext, useState } from "react";
import { processStockData } from "../utils";
import { fetchStockData } from "../store";
import { extractValueAndUnit } from "../utils";

const StockDataContext = createContext();

export const useStockData = () => useContext(StockDataContext);

const handleFetchStockDetails = async (interval) => {
    const { value, unit } = extractValueAndUnit(interval)

    const response = await fetchStockData({ unit })
    return response
}

const StockDataProvider = ({ children }) => {
    const [stockData, setStockData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async (interval) => {

        try {
            setLoading(true);
            const response = await handleFetchStockDetails(interval)

            if (response.status === 200) {
                const rawData = response.data;

                const processedData = processStockData(rawData, interval);
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
