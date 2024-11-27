import React, { createContext, useContext, useState } from "react";

const StockDataContext = createContext();

export const useStockData = () => useContext(StockDataContext);

function generateDataWithSharpTurns(numValues, startDate = '2024-10-01') {
    const data = [];
    let currentValue = 100;

    for (let i = 0; i < numValues; i++) {
        const direction = Math.random() < 0.5 ? -1 : 1;

        const newValue = Math.max(0, currentValue + direction * (Math.random() * 5 + 1));

        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const formattedDate = date.toISOString().split('T')[0];

        data.push({
            time: formattedDate,
            value: Number(newValue.toFixed(2)) 
        });

        currentValue = newValue;
    }

    return data;
}

const StockDataProvider = ({ children }) => {
    const [stockData, setStockData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async (interval, numValues = 1000, startDate = '2024-10-01') => {
        setLoading(true)

        setTimeout(() => {
            const response = generateDataWithSharpTurns(numValues)
            setLoading(false)
            setStockData(response)
        }, 1000);
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
