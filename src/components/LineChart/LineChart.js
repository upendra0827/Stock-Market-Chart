import React, { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';
import { useStockData } from "../../context/StockDataContext";
import { useNavigate, useLocation } from "react-router-dom";
import CompareIcon from '../../Icons/Compare.svg';
import FullScreenIcon from '../../Icons/FullScreen.svg';

const LineChart = () => {
    const { stockData, fetchData, loading } = useStockData();
    const chartContainerRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();

    const [activeInterval, setActiveInterval] = useState('1d');
    const [isFullScreen, setIsFullScreen] = useState(false);

    const getFilterValue = (key) => {
        const searchParams = new URLSearchParams(location.search);
        return searchParams.get(key);
    };

    const intervals = [
        { value: '1d', isSelected: true },
        { value: '3d', isSelected: true },
        { value: '1w', isSelected: false },
        { value: '1m', isSelected: false },
        { value: '1y', isSelected: false },
        { value: 'max', isSelected: true },
    ];

    const handleUpdateQueryParams = (key, value) => {
        const searchParams = new URLSearchParams(location.search);
        searchParams.set(key, value);
        navigate({ search: `${searchParams.toString()}` }, { response: true });
    };

    const handleChangeInterval = ({ value }) => {
        setActiveInterval(value);
        handleUpdateQueryParams('interval', value);
    };

    useEffect(() => {
        const filterValue = getFilterValue('interval');
        setActiveInterval(filterValue || '1d');
        fetchData(filterValue || '1d', 1000);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.search]);

    useEffect(() => {
        if (!chartContainerRef.current) return;
        const chart = createChart(chartContainerRef.current, {
            layout: {
                textColor: 'white',
                background: { type: 'solid', color: 'white' },
                fontSize: 18,
                fontFamily: 'Circular Std',
                crosshairMarkerVisible: false, 
            },
            grid: {
                vertLines: { visible: true },
                horzLines: { visible: false },
            },
            timeScale: {
                borderVisible: true, 
                borderColor: '#E2E4E7',
                visible: false,
                tickMarkFormatter: () => "",
                labelFormatter: () => '',
            },
            leftPriceScale: {
                borderVisible: true,
                visible: false,
                tickMarkFormatter: () => "",
                labelFormatter: () => '',
                borderColor: '#E2E4E7', 
            },
            rightPriceScale: {
                borderColor: '#E2E4E7', 
            },
        });

        const areaSeries = chart.addAreaSeries({
            topColor: '#E8E7FF',
            bottomColor: 'white',
            lineColor: '#4B40EE',
            lineWidth: 2,
            crosshairMarkerVisible: false,
        });

        areaSeries.priceScale().applyOptions({
            scaleMargins: { top: 0.1, bottom: 0.4 },
            textColor: 'white',
            fontFamily: 'Arial',
            fontSize: 12,
            fontWeight: 'bold',
        });

        areaSeries.applyOptions({
            priceLineVisible: false,
        });

        const volumeSeries = chart.addHistogramSeries({
            color: '#E6E8EB',
            textColor: 'white',
            priceFormat: { type: 'volume' },
            priceScaleId: '',
            scaleMargins: { top: 0.7, bottom: 0 },
            fontSize: 0,
        });

        volumeSeries.priceScale().applyOptions({
            scaleMargins: { top: 0.95, bottom: 0 },
            fontSize: 0
        });

        volumeSeries.applyOptions({
            priceLineVisible: false,
        });

        areaSeries.setData(stockData);
        volumeSeries.setData(stockData);

        document.getElementById('tv-attr-logo').style.display = 'none';

        return () => {
            chart.remove();
        };
    }, [stockData]);

    const handleFullScreen = () => {
        const container = chartContainerRef.current;
        if (container) {
            if (container.requestFullscreen) {
                container.requestFullscreen();
            } else if (container.webkitRequestFullscreen) {
                container.webkitRequestFullscreen();
            } else if (container.msRequestFullscreen) {
                container.msRequestFullscreen();
            }
            setIsFullScreen(true);
        }
    };

    return (
        <>
            <div className="charts__container__intervals">
                <div>
                    <div onClick={handleFullScreen}>
                        <img src={FullScreenIcon} alt="fullscreen-icon" />
                        <div>Full Screen</div>
                    </div>
                    <div >
                        <img src={CompareIcon} alt="exit-fullscreen-icon" />
                        <div>Compare</div>
                    </div>
                </div>
                <div>
                    {intervals?.map((interval, i) => (
                        <button
                            key={i}
                            className={`${interval.value === activeInterval && 'active'}`}
                            onClick={() => handleChangeInterval({ value: interval['value'] })}
                        >
                            {interval['value']}
                        </button>
                    ))}
                </div>
            </div>
            {loading ? (
                <div>Loading............</div>
            ) : stockData?.length ? (
                <div
                    className={`chart ${isFullScreen ? 'fullscreen' : ''}`}
                    ref={chartContainerRef}
                    style={{
                        width: isFullScreen ? '100%' : '1400px',
                        height: isFullScreen ? '100%' : '500px',
                        borderLeft: '1px solid #E2E4E7', 
                    }}
                ></div>
            ) : null}
        </>
    );
};

export default LineChart;
