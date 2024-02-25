import {ListGroup, Card, Row, Col, Container, Spinner} from 'react-bootstrap';
import React, { useState, useEffect } from 'react';

// username = "user1";

function StocksList() {
    // var stockValue = 123.45;
    // const listExample = {
    //     "AAPL": "184.37",
    //     "IBM": "184.21",
    //     "MSFT": "411.65",
    //     "GOOGL": "144.09",
    //     "AMZN": "174.58"
    // }
    const [list, setList] = useState(null);
    useEffect(()=>{
        fetch('http://localhost:5000/api/portfolio')
        .then(response => response.json())
        .then(list => setList(list))
        .catch(error => console.error("Error fetching data: ", error));
    }, []);

    return (
        <Container className='min-vh-100 container-sm'>
            <h1>Your portfolio</h1>
            <Card className='my-5'>
                <Card.Header>User: {"user1"}</Card.Header>
                <ListGroup variant='flush'>
                    {!list ? (
                        <Spinner animation="border" />
                    ):(
                
                        Object.entries(list).map(([key, value]) =>( //this will map the contents of the json into a ListGroup.item
                            <ListGroup.Item action href="http://localhost:5000/api/portfolio/" key={key}>
                                <Row>
                                    <Col className='fs-4 fw-bold'>{key}</Col>
                                    <Col className='fs-5'>${value}</Col>
                                </Row>
                            </ListGroup.Item>
                        ))
                    )
                    }
                </ListGroup>
            </Card>
        </Container>
    );
}

export default StocksList;