import React from 'react';
import { Card } from 'react-bootstrap';

import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';
import FloatingLabel from 'react-bootstrap/FloatingLabel';

function LoginForm({getUsername, url}) {
    const [validated, setValidated] = useState(false); //for validating form:
    const [loading, setLoading] = useState(false);
    const [requestStatus, setRequestStatus] = useState('')
    //for logging user in:
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {   //this is for checking if the inputs are correct
            setRequestStatus('');
            event.preventDefault();
            event.stopPropagation();
        }

        setValidated(true);
        const loginUrl = `${url}/login`  //for development
        if (form.checkValidity() === true){
            setLoading(true);
            setRequestStatus('');
            try{    //try to send request:
                const response = await fetch(loginUrl, {
                    method: 'POST',
                    credentials: 'include', // Needed for cookies to be included in the request
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password }),
                });
                if (response.ok) {
                    getUsername(username)  //use the function sent by App (parent component)
                    console.log(`Get username ok: ${username}`)
                } else {
                    setLoading(false);
                    setRequestStatus("Wrong username or password");
                    setValidated(false)
                }

            } catch(error){
                setLoading(false)
                console.error("Fetch error:", error.message);
                setRequestStatus('Could not connect to the server. Please try again later.')
            }
        }
    };

    return (
        <main className="form-signin w-100 m-auto min-vh-100 d-flex align-items-center">
            <Card className='m-auto p-5' style={{width:'400px'}}>
                <div className='mb-3'>
                    <span className="mb-4 fs-1" width="72" height="57">💸</span>
                    <span className='fs-3'>Wingy</span>
                </div>
                <h1 className="h3 mb-3 fw-normal fs-5">Please sign in</h1>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Form.Group as={Col} controlId="validationCustom01">
                        <FloatingLabel controlId="floatingInput" label="Username">
                            <Form.Control
                                required
                                type="username"
                                placeholder="Your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </FloatingLabel>
                        
                        <Form.Control.Feedback type="invalid">
                            Enter a valid username
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} controlId="validationCustom02" className='mt-3'>
                        <FloatingLabel controlId="floatingPassword" label="Password">
                            <Form.Control
                                required
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </FloatingLabel>
                        <Form.Control.Feedback type="invalid">
                            Enter your password
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Button type="submit" className='mt-3'>Log in</Button>
                </Form>
                {
                    loading&&
                    <>
                        <Spinner className='m-auto'></Spinner>
                    </>
                }
                <p className='mt-2 text-secondary'>{requestStatus}</p>
            </Card>
        </main>
    );
}

export default LoginForm;