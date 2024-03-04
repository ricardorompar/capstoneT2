// import {ListGroup, Card, Container, Spinner, Button} from 'react-bootstrap';
import {Offcanvas, Button, ListGroup, Spinner, Container, Row } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import ListComponent from './ListComponent';

function StocksList() {
    const [list, setList] = useState(null);
    // this is for the offcanvas:
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    useEffect(()=>{
        fetch('https://mcsbt-integration-rickyr.nw.r.appspot.com/api/portfolio').then(response => response.json()).then(list => setList(list))
        .catch(error => console.error("Error fetching data: ", error));
    }, []);

    return (
    <Container className='center-content min-vh-100'>
        <Row>
            <Button variant="primary" onClick={handleShow} className='m-auto'>
                Choose Stock
            </Button>
        </Row>
        

        <Offcanvas show={show} onHide={handleClose}>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Offcanvas</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                    <ListGroup variant='flush'>
                        {!list ? (
                            <Spinner className='my-5 mx-auto' animation="border" />
                        ):(
                            Object.entries(list).map(([itemKey, itemValue]) =>( //this will map the contents of the json into a ListGroup.item
                                <ListComponent key={itemKey} itemKey={itemKey} itemValue={itemValue}></ListComponent>
                            ))
                        )}
                </ListGroup>
            </Offcanvas.Body>
        </Offcanvas>
    </Container>


        // <Container>
        //     <h1>Your portfolio</h1>
        //     <Card className='my-5 w-75 m-auto'>
        //         <Card.Header>User: {"user1"}</Card.Header>

        //     </Card>
        // </Container>
    );
}

export default StocksList;