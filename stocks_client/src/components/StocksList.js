import {ListGroup, Card, Container, Spinner, Button} from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import ListComponent from './ListComponent';

function StocksList() {
    const [list, setList] = useState(null);
    useEffect(()=>{
        fetch('http://localhost:5000/api/portfolio')
        .then(response => response.json())
        .then(list => setList(list))
        .catch(error => console.error("Error fetching data: ", error));
    }, []);

    return (
        <Container>
            <h1>Your portfolio</h1>
            <Card className='my-5 w-75 m-auto'>
                <Card.Header>User: {"user1"}</Card.Header>
                <ListGroup variant='flush'>
                    {!list ? (
                        <Spinner className='my-5 mx-auto' animation="border" />
                    ):(
                        Object.entries(list).map(([itemKey, itemValue]) =>( //this will map the contents of the json into a ListGroup.item
                            <ListComponent key={itemKey} itemKey={itemKey} itemValue={itemValue}></ListComponent>
                        ))
                    )
                    }
                </ListGroup>
            </Card>
        </Container>
    );
}

export default StocksList;