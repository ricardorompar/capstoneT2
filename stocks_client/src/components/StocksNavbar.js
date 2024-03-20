import React, { useState } from 'react';
import { NavDropdown, Container, Navbar, Nav, Button, Modal, Row } from 'react-bootstrap';

function StocksNavbar({user, logUserOut}) {
    //Stuff for modal:
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    //this function logs the user out after modal pops up
    async function handleClick(){
        handleClose();
        logUserOut();
    };
    return (
        <Navbar expand="lg">
            <Container expand="lg" className=' pb-3 my-2 border-bottom'>
                <Navbar.Brand href="#home">💸 Wingy</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="#home">Home</Nav.Link>
                        <Nav.Link href="#link">Features</Nav.Link>
                        <NavDropdown title="About" id="basic-nav-dropdown">
                            <NavDropdown.Item href="https://www.alphavantage.co/documentation/">
                                AlphaVantage
                            </NavDropdown.Item>
                            <NavDropdown.Item href="https://github.com/ricardorompar/capstoneT2">Capstone Project</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="https://github.com/ricardorompar">
                                ricardorompar
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Nav>
                        <Navbar.Text className='mx-2'>Logged in: <b>{user}</b></Navbar.Text>
                        <Button variant="outline-secondary" onClick={handleShow}>
                            Log Out
                        </Button>

                        <Modal show={show} onHide={handleClose}>
                            <Modal.Header closeButton>
                                <Modal.Title>Log out from {user}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>Are you sure?</Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose}>
                                    Cancel
                                </Button>
                                <Button variant="danger" onClick={handleClick}>
                                    Log out
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default StocksNavbar;