import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { useStockData } from "../../context/StockDataContext";
import { useNavigate, useLocation } from "react-router-dom";
import CompareIcon from '../../Icons/Compare.svg'
import FullScreenIcon from '../../Icons/FullScreen.svg'

const LineChart = () => {

    const { stockData, fetchData, loading, } = useStockData();

    const location = useLocation()
    const navigate = useNavigate()

    const getFilterValue = (key) => {
        const searchParams = new URLSearchParams(location.search);
        return searchParams.get(key);
    };

    const intervals = [
        { value: '1d', isSelected: true },
        { value: '1w', isSelected: false },
        { value: '1m', isSelected: false },
        { value: '1y', isSelected: false },
    ]

    const [activeInterval, setActiveInterval] = useState('1d')

    const handleUpdateQueryParams = (key, value) => {
        const searchParams = new URLSearchParams(location.search)
        searchParams.set(key, value)
        navigate({ search: `${searchParams.toString()}` }, { response: true })
    }

    const handleChangeInterval = ({ value }) => {
        setActiveInterval(value)

        handleUpdateQueryParams('interval', value)
    }

    useEffect(() => {
        const filterValue = getFilterValue('interval');
        setActiveInterval(filterValue || '1d');
        fetchData(filterValue || '1d');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.search]);

    const options = {
        chart: {
            height: 700,
            width: "100%",
            type: "area",
            background: "transparent",
            toolbar: {
                show: false,
            },
        },
        xaxis: {
            categories: stockData?.categories,
            labels: {
                show: false,
                rotate: -45,
                style: {
                    colors: '#000000',
                    fontSize: '12px',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    fontWeight: 400,
                },
            },
            axisBorder: {
                show: false,
            },
        },
        yaxis: {
            labels: {
                show: false,
            },
        },
        grid: {
            show: true,
            borderColor: "#e7e7e7",
            strokeDashArray: 0,
            xaxis: {
                lines: {
                    show: true,
                },
            },
            yaxis: {
                lines: {
                    show: false,
                },
            },
        },
        colors: ["#4B40EE"],
        fill: {
            colors: ["#4B40EE"],
            opacity: 0.3,
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: 'straight',
            width: 2,
        },
        crosshairs: {
            show: true,
            position: "front",
            stroke: {
                color: "#FF0000",
                width: 1,
                dashArray: 0,
            },
        },
        tooltip: {
            followCursor: false,
            fixed: {
                enabled: false,
                position: 'topRight',
                offsetX: 0,
                offsetY: 0,
            },
            custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                return '<div class="arrow_box">' +
                    '<span>' + series[seriesIndex][dataPointIndex] + '</span>' +
                    '</div>'
            }
        }
    };


    if (loading) return <div>Loading............</div>

    return (
        <>
            <div className="charts__container__intervals">
                <div>
                    <div>
                        <img src={FullScreenIcon} alt="fullscreen-icon" />
                        <div>Full Screen</div>
                    </div>
                    <div>
                        <img src={CompareIcon} alt="compare-icon" />
                        <div>Compare</div>
                    </div>
                </div>
                <div>
                    {intervals?.map((interval, i) => <button
                        key={i}
                        className={`${interval.value === activeInterval && 'active'}`}
                        onClick={() => handleChangeInterval({ value: interval['value'] })}
                    >{interval['value']}</button>)}
                </div>
            </div>
            {stockData?.series && <Chart
                className='chart'
                options={options} series={stockData.series} type="area" />}
        </>
    )
};

export default LineChart;
