import './App.css';
import { Container } from 'react-bootstrap';
import StocksNavbar from './components/StocksNavbar';
import StocksFooter from './components/StocksFooter';
import Portfolio from './components/Portfolio';
import LoginForm from './components/LoginForm';

import React, { useState, useEffect } from 'react';

//Workflow: login checks user in database -> if true sets state variable loggedUser -> get list of stocks for each user
// when user selects a stock sets selectedStock to see past values

function App() {
    const [loggedUser, setLoggedUser] = useState(null);
    const [showContent, setShowContent] = useState(false);

    const loginSuccess = (username) => {
        setLoggedUser(username);
        setShowContent(true)
    }

    const logOut = () => {
        setLoggedUser('');
        setShowContent(false)
    }

    return (
        <div>
        <Container>
            {!showContent ? (
                <LoginForm getUsername={loginSuccess}/>
            ):(
                <Container className='min-vh-100'>
                    <StocksNavbar user={loggedUser} logUserOut={logOut}></StocksNavbar>
                    <Portfolio user={loggedUser}></Portfolio>
                    <StocksFooter></StocksFooter>
                </Container>
            )}
        </Container>
        </div>
    );
}

export default App;
