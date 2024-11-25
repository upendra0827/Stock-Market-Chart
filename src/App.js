import './App.css';
import AppRoutes from './routes/AppRoutes';
import StockDataProvider from './context/StockDataContext';

function App() {
  return (
    <StockDataProvider>
      <div className='App'>
        < AppRoutes />
      </div>
    </StockDataProvider>
  );
}

export default App;
