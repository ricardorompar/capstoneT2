import {ListGroup, Row, Spinner, Col, Button} from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import PastValues from './PastValues';

function ListComponent({itemKey, itemValue}) {

    const [showPValues, setShowPValues] = useState(null);
    const [data, setData] = useState(null);

    const handleClick = () => {
        // Make the request to the server
        setShowPValues(true);
        fetch(`http://localhost:5000/api/portfolio/${itemKey}`)
        .then(response => response.json())
        .then(data => {
            setData(data); // Log the data or do something with it
        })
        .catch(error => console.error('Error:', error));
    }

    return (
        <ListGroup.Item key={itemKey}>
            <Row>
                <Col xs={5} className='col-auto me-auto'>
                    <Button onClick={handleClick} variant='outline-primary' className='fs-4 fw-bold'>{itemKey}</Button>
                </Col>
                <Col className='fs-5 col-auto'>${itemValue}</Col>
            </Row>
            {showPValues && <PastValues data={data}/>}
        </ListGroup.Item>
    );
}

export default ListComponent;