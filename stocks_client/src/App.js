import './App.css';
import { Container } from 'react-bootstrap';
import StocksNavbar from './components/StocksNavbar';
import StocksFooter from './components/StocksFooter';
import Portfolio from './components/Portfolio';
import LoginForm from './components/LoginForm';
import { Spinner } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';

const url = "http://127.0.0.1:5000";

function App() {
    const [loggedUser, setLoggedUser] = useState('');
    const [showContent, setShowContent] = useState(false);
    const [list, setList] = useState(null);
    const [modification, setModification] = useState(null);
    const [loading, setLoading] = useState(false);
    const [reloader, setReloader] = useState(false);

    const loginSuccess = (username) => {
        setLoggedUser(username);
        setShowContent(true)
    }

    const logOut = () => {
        setLoggedUser('');
        setShowContent(false)
    }    

    const handleReload = () => {
        setReloader(!reloader)
    }

    const changeModif = (values) => setModification(values);

    async function loadList(){
        //This function defines the first request that this component makes when it renders after login.
        setLoading(true);
        try{    //try to send request:
            const response = await fetch(url+`/api/portfolio?user=${loggedUser}`, {
                method: 'GET',
                mode: 'cors',
                credentials: 'include' // Needed for cookies to be included in the request
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data) ; //debugging
                setList(data);
                setLoading(false);
            }else{
                console.log(response)
            }
        } catch(error){
            console.error("Error fetching data: ", error.message);
        }
    };

    async function sendLogOut(){
        try{    //try to send request:
            const response = await fetch(url+`/logout`, {
                method: 'POST',
                mode: 'cors',
                credentials: 'include' // Needed for cookies to be included in the request
            });
            if (response.ok) {
                const data = await response.json()
                console.log(data.json)
            }else{
                console.log(response)
            }
        } catch(error){
            console.error("Error fetching data: ", error.message);
        }
    };
    //This useffect is for when the logged user changes:
    useEffect(()=>{
        if(loggedUser!==''){ //execute this only if the user is logged in:
            loadList();
        }
        else{  //else execute for logout:
            sendLogOut();
        }
    }, [loggedUser, reloader]);

    useEffect(()=>{
        async function updateUser(){
            setLoading(true);
            try{    //try to send request:
                const response = await fetch(url+`/api/update_user`, {
                    method: 'POST',
                    mode: 'cors',
                    credentials: 'include', // Needed for cookies to be included in the request
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    body: modification //remember the modification was already jsonified
                });
                if (response.ok) {
                    const data = await response.json()
                    console.log(data.json)
                    setLoading(false);
                    loadList(); //if response ok
                }else{
                    console.log(response)
                }
            } catch(error){
                console.error("Error fetching data: ", error.message);
            }
        };
        updateUser();   //load list after sending the update request
    }, [modification])

    return (
        <div>
        <Container>
            {!showContent ? (
                <LoginForm getUsername={loginSuccess} url={url}/>
            ):(
                <Container className='min-vh-100'>
                    <StocksNavbar user={loggedUser} logUserOut={logOut}></StocksNavbar>
                    <Portfolio user={loggedUser} list={list} changeModif={changeModif} loading={loading} handleReload={handleReload} url={url}></Portfolio>
                    <StocksFooter></StocksFooter>
                </Container>
            )}
        </Container>
        </div>
    );
}

export default App;
