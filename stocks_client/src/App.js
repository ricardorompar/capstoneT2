import './App.css';
import { Container } from 'react-bootstrap';
import StocksNavbar from './components/StocksNavbar';
import StocksFooter from './components/StocksFooter';
import Portfolio from './components/Portfolio';
import LoginForm from './components/LoginForm';
import React, { useState, useEffect } from 'react';
import AboutModal from './components/AboutModal';

const url = "http://127.0.0.1:5000"; //development
// const url="https://mcsbt-integration-rickyr.nw.r.appspot.com"


function App() {

    var storedUser = localStorage.getItem("storedUser");
    var userFound = storedUser?true:false; //change to true if theres a stored value and false otherwise.

    const [loggedUser, setLoggedUser] = useState(storedUser);
    //DEBUGGING------------------------------------------------------------------------------------------------------------------------------------------------
    console.log(`HELLO FROM THE START ${JSON.stringify(loggedUser)}`);
    const [showContent, setShowContent] = useState(userFound);
    const [list, setList] = useState(null);
    const [modification, setModification] = useState(null);
    const [loading, setLoading] = useState(false);
    const [reloader, setReloader] = useState(false);
    const [showAboutModal, setShowAboutModal] = useState(false);

    async function loadList() {
        //This function defines the first request that this component makes when it renders after login.
        try {
            setLoading(true);
            const response = await fetch(`${url}/api/portfolio?user=${loggedUser}`, {
                method: 'GET',
                // mode: 'cors',
                credentials: 'include' // Needed for cookies to be included in the request
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setList(data);
        } catch (error) {
            console.error("Error fetching data: ", error.message);
        } finally {
            setLoading(false);
        }
    };


    async function sendLogOut(){
        if (setLoggedUser !== ''){ //only do this if there actually is a logged user
            try{    //try to send request:
                const response = await fetch(`${url}/logout`, {
                    method: 'POST',
                    // mode: 'cors',
                    credentials: 'include' // Needed for cookies to be included in the request
                });
                if (response.ok) {
                    const data = await response.json()
                    console.log(data.message)
                }else{
                    console.log(response)
                }
            } catch(error){
                console.error("Error fetching data: ", error.message);
            }
        }
    };

    async function updateUser(){
        setLoading(true);
        if(modification!==null){    //only attempt to do this if the modification is other than null
            try{    //try to send request:

                const response = await fetch(url+`/api/update_user`, {
                    method: 'POST',
                    // mode: 'cors',
                    credentials: 'include', // Needed for cookies to be included in the request
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    body: modification //remember the modification was already jsonified
                });
                if (response.ok) {
                    const data = await response.json()

                    loadList(); //if response ok
                }else{
                    console.log(response)
                }
            } catch(error){
                console.error("Error fetching data: ", error.message);
        }
        }    
    };

    const loginSuccess = (username) => {
        //DEBUGGING------------------------------------------------------------------------------------------------------------------------------------------------
        console.log('HELLO FROM LOGINSUCCESS--------------------', username)
        setShowContent(true);
        setLoggedUser(username);
        localStorage.setItem("storedUser", username);   //i also store in the localstorage to guarantee a persistent session
    }

    const logOut = () => {
        sendLogOut();
        setLoggedUser('');
        setShowContent(false);
        localStorage.removeItem("storedUser");
    }    

    const handleReload = () => {
        setReloader(!reloader)
    }

    const changeModif = (values) => setModification(values);

    useEffect(()=>{
        if(showContent){
            loadList();
        }
    }, [loggedUser, reloader]);

    useEffect(()=>{
        if (showContent){   //this variable changes after login. This way i guarantee that these requests will only be made after login
            console.log('HELLO FROM MODIFICATION IF--------------------', modification)
            updateUser();   //load list after sending the update request
        }
    }, [modification]);

    //when reloading the page:
    useEffect(() => {
        async function checkLogin() {
            setLoading(true);
            if(loggedUser){
                try { //try to send request:
                    const response = await fetch(`${url}/is_logged_in`, {
                        mode: 'cors',
                        credentials: 'include'
                    });
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }else{
                        const data = await response.json();              
                        console.log(`Get username ok: ${data.username}`);
                        loginSuccess(data.username);
                    }
                } catch (error) {
                    console.error("Error checking login status: ", error.message);
                } finally {
                    setLoading(false);
                };
            };
        };
        if(showContent){
            checkLogin();
        };
    }, []); //no dependencies because it only runs on reload

    return (
        <div>
        <Container>
            {!showContent ? (
                <LoginForm getUsername={loginSuccess} url={url}/>
            ):(
                <Container className='min-vh-100'>
                    <StocksNavbar user={loggedUser} logUserOut={logOut} setShowAboutModal={setShowAboutModal}></StocksNavbar>
                    <Portfolio user={loggedUser} list={list} changeModif={changeModif} loading={loading} handleReload={handleReload} url={url}></Portfolio>
                    <AboutModal setShowAboutModal={setShowAboutModal} showAboutModal={showAboutModal}></AboutModal>
                    <StocksFooter setShowAboutModal={setShowAboutModal}></StocksFooter>
                </Container>
            )}
        </Container>
        </div>
    );
}

export default App;
