import {ListGroup, Row, Badge, Col, Button} from 'react-bootstrap';
import React from 'react';
// import PastValues from './PastValues';

function ListComponent({itemKey, itemValue, onSelectStock}) {

    const handleClick = () => {
        onSelectStock(itemKey, itemValue);
    };

    return (
        <ListGroup.Item key={itemKey}>
            <Row>
                <Col xs={5} className='col-auto me-auto'>
                    <Button onClick={handleClick} variant='outline-secondary' className='fs-4 fw-bold'>{itemKey}</Button>
                </Col>
                {/* In this case i passed from the parent element an itemValue that i know for a fact that is anoter js object */}
                <Col className='col-auto'><Badge className='fs-5'>{itemValue.num_stocks}</Badge></Col>
                <Col className='fs-5 col-auto'>${itemValue.last_close}</Col>
            </Row>
            {/* {showPValues && <PastValues data={data}/>} */}
        </ListGroup.Item>
    );
}

export default ListComponent;