import React, { useEffect, useState } from "react";

import { useNavigate, Outlet } from "react-router-dom";

import { useStockData } from "../../context/StockDataContext";
import Loading2Icon from '../../Icons/Loading2.svg'


const StockChart = () => {

    const { stockData, fetchData, loading } = useStockData();

    const oldValue = stockData?.at(0)['value']

    const latestValue = stockData?.at(-1)['value']

    const changeOfPriceInPercentage = ((latestValue - oldValue) / oldValue) * 100

    const sections = ['Summary', 'Charts', 'Statistics', 'Analytics', 'Settings']

    const [activeSection, setActiveSection] = useState('summary')

    const navigate = useNavigate()

    useEffect(() => {
        fetchData('1d', 1000);

        const path = window.location.pathname;
        const extractedPart = path.split('/')[1];
        setActiveSection(extractedPart);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChangeSection = ({ section }) => {
        setActiveSection(section)
        navigate(`${section.toLowerCase()}`)
    }


    return (
        <div className="charts__container">
            {loading && <div style={{ height: '94px', display: 'flex' }}>
                <img src={Loading2Icon} alt="Loading..." width="100" height="100" />
            </div>}
            {!loading &&
                <header>
                    <div>
                        <div className="current-price">{latestValue}</div>
                        <div className="currency">USD</div>
                    </div>
                    <div className={`percentage-change ${Number(changeOfPriceInPercentage) < 0 ? 'negative' : 'positive'}`}>
                        {`${Number(changeOfPriceInPercentage) >= 0 ? '+' : ''} ${(latestValue - oldValue).toFixed(2)} (${changeOfPriceInPercentage.toFixed(2)}%)`}
                    </div>
                </header>
            }
            <div className="charts__container__sections">
                {sections.map((section, i) => (
                    <button key={i} className={`${section.toLowerCase() === activeSection.toLowerCase() && 'active-section'}`} onClick={() => handleChangeSection({ section })}>{section}</button>
                ))}
            </div>
            <hr />
            <Outlet />
        </div>
    );
};

export default StockChart;
