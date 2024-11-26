const API_KEY = process.env.REACT_APP_API_KEY

export const URLs = {
    STOCK_DETAILS: `https://www.alphavantage.co/query?function={interval}&symbol=IBM&interval=15min&apikey=${API_KEY}`
}