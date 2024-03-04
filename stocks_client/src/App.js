import './App.css';
import { Container } from 'react-bootstrap';
import StocksNavbar from './components/StocksNavbar';
import StocksFooter from './components/StocksFooter';
import StocksList from './components/StocksList';

function App() {
  return (
    <div>
      <Container>
        <StocksNavbar></StocksNavbar>
        <StocksList></StocksList>
        <StocksFooter></StocksFooter>
      </Container>
    </div>
  );
}

export default App;
