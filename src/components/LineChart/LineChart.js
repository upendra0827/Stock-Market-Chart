import React, { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';
import { useStockData } from "../../context/StockDataContext";
import { useNavigate, useLocation } from "react-router-dom";
import CompareIcon from '../../Icons/Compare.svg';
import FullScreenIcon from '../../Icons/FullScreen.svg';
import CloseIcon from '../../Icons/Close.svg';
import LoadingIcon from '../../Icons/Loading.svg'

const LineChart = () => {
    const { stockData, fetchData, loading } = useStockData();
    const chartContainerRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();

    const [activeInterval, setActiveInterval] = useState('1d');
    const [isFullScreen, setIsFullScreen] = useState(false);
    const containerRef = useRef(null)

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

    const isMobile = window.innerWidth < 768;

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
                fontSize: isMobile ? 16 : 18,
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
                visible: true,
                width: isMobile ? 40 : 50,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stockData]);

    const handleFullScreen = () => {
        const container = containerRef.current;
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

    const handleExitFullScreen = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
        setIsFullScreen(false);
    }

    return (
        <>
            <div className="charts__container__intervals">
                <div>
                    <div onClick={handleFullScreen} className='charts__container__intervals_fullscreen'>
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
            <div className='chart__container__chart'>
                {loading ? (
                    <img src={LoadingIcon} alt="Loading..." width="100" height="100" />
                ) : stockData?.length ? (
                    <div ref={containerRef} className={`chart__container ${isFullScreen ? 'fullscreen' : ''}`}>
                        <div
                            className={`chart ${isFullScreen && 'fullscreen-chart'}`}
                            ref={chartContainerRef}
                            style={{
                                width: isFullScreen ? '100%' : '100%',
                                height: isFullScreen ? '100%' : '500px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        ></div>
                        {isFullScreen && (
                            <div
                                className="chart__container__exit-fullscreen-icon"
                                onClick={handleExitFullScreen}
                            >
                                <img src={CloseIcon} alt='close-icon' />
                            </div>
                        )}
                    </div>
                ) : null}
            </div>
        </>
    );
};

export default LineChart;
