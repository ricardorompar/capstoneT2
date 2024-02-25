import {ListGroup, Card, Row, Col, Container, Spinner, Button} from 'react-bootstrap';
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

    // const [showComponent, setShowComponent] = useState(null);
    // const handleClick = () => {
    //     fetch(`http://localhost:5000/api/portfolio/${key}`)
    //     .then(response => response.json())
    // }

    return (
        <Container className='min-vh-100'>
            <h1>Your portfolio</h1>
            <Card className='my-5 w-75 m-auto'>
                <Card.Header>User: {"user1"}</Card.Header>
                <ListGroup variant='flush'>
                    {!list ? (
                        <Spinner className='my-5 mx-auto' animation="border" />
                    ):(
                        Object.entries(list).map(([key, value]) =>( //this will map the contents of the json into a ListGroup.item
                            <ListGroup.Item key={key}>
                                <Row>
                                    <Col xs={5} className='col-auto me-auto'>
                                        <Button action href={"http://localhost:5000/api/portfolio/"+key} variant='outline-primary' className='fs-4 fw-bold'>{key}</Button>
                                    </Col>
                                    <Col className='fs-5 col-auto'>${value}</Col>
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