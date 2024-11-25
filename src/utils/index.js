export function extractValueAndUnit(input) {
    const value = parseInt(input.match(/\d+/)[0], 10);
    const unit = input.match(/[a-zA-Z]+/)[0];
    return { value, unit };
}

export function processStockData(data, interval) {
    const { value, unit } = extractValueAndUnit(interval)

    let formattedData = [];

    const timeSeriesKey = Object.keys(data).find((key) =>
        key.toLowerCase().includes("time series")
    );

    if (!timeSeriesKey) {
        throw new Error("Time series data not found in the provided object.");
    }

    const timeSeries = data[timeSeriesKey];

    const firstEntry = Object.values(timeSeries)[0];
    const dynamicKeys = {
        open: Object.keys(firstEntry).find((key) => key.toLowerCase().includes("open")),
        high: Object.keys(firstEntry).find((key) => key.toLowerCase().includes("high")),
        low: Object.keys(firstEntry).find((key) => key.toLowerCase().includes("low")),
        close: Object.keys(firstEntry).find((key) => key.toLowerCase().includes("close")),
        volume: Object.keys(firstEntry).find((key) => key.toLowerCase().includes("volume")),
    };

    for (const timestamp in timeSeries) {
        const entry = timeSeries[timestamp];

        formattedData.push({
            timestamp: timestamp,
            open: parseFloat(entry[dynamicKeys.open]),
            high: parseFloat(entry[dynamicKeys.high]),
            low: parseFloat(entry[dynamicKeys.low]),
            close: parseFloat(entry[dynamicKeys.close]),
            volume: parseInt(entry[dynamicKeys.volume]),
        });
    }

    if (unit === 'd') {
        // formattedData = formattedData.slice(0, value)
    } else if (unit === 'w') {
        formattedData = formattedData.slice(0, value * 7)
    } else if (unit === 'm') {
        formattedData = formattedData.slice(0, value*4)
    } else if (unit === 'y') {
        formattedData = formattedData.slice(0, value*12)
    }

    const categories = formattedData.map((entry) => entry.timestamp).reverse()    

    const series = [
        // {
        //     name: "Open",
        //     data: formattedData.map((entry) => entry.open),
        // },
        // {
        //     name: "High",
        //     data: formattedData.map((entry) => entry.high),
        // },
        // {
        //     name: "Low",
        //     data: formattedData.map((entry) => entry.low),
        // },
        {
            name: "Close",
            data: formattedData.map((entry) => entry.close).reverse(),
        },
    ];

    return { series, categories };
}
