import './App.css';
import { Container } from 'react-bootstrap';
import StocksNavbar from './components/StocksNavbar';
import StocksFooter from './components/StocksFooter';
import StocksList from './components/StocksList';
import LoginForm from './components/LoginForm';

import React, { useState, useEffect } from 'react';

function App() {
    const [loggedUser, setLoggedUser] = useState(null);
    const [showContent, setShowContent] = useState(false);

    const loginSuccess = (username) => {
        setLoggedUser(username);
        setShowContent(true)
    }

    return (
        <div>
        <Container>
            {!showContent ? (
                <LoginForm getUsername={loginSuccess}/>
            ):(
                <>
                    <StocksNavbar></StocksNavbar>
                    {/* <StocksList></StocksList> */}
                    <StocksFooter></StocksFooter>
                </>
            )}
        </Container>
        </div>
    );
}

export default App;
