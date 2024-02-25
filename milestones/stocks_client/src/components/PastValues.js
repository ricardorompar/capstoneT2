import {ListGroup, Card, Row, Col, Container, Spinner, Button} from 'react-bootstrap';
import React, { useState, useEffect } from 'react';

function PastValues({data, showPValues}) {  //this component receives a key as a parameter like AMZN

    var stringData = JSON.stringify(data)
    return (
        <Container>
            {!data ?(
                <Spinner className='my-2 mx-auto' animation="border" />
            ):(
                <Card className='my-3' variant='flush'>
                    <ListGroup variant='flush'>
                            {
                                Object.entries(data.values_daily).map(([date, values]) =>( //this will map the contents of the json into a ListGroup.item
                                    <ListGroup.Item key={date}>
                                        <p className='fs-3'>{date}</p>
                                        {   //in this case the value is another object:
                                            Object.entries(values).map(([key, price]) =>(
                                                <Row>
                                                    <Col className='col-auto me-auto'>{key}</Col>
                                                    {
                                                        (key=="5. volume")?(    //if the value is the volume i dont want the dollar sign
                                                            <Col className='col-auto'>{price}</Col>
                                                        ):(
                                                            <Col className='col-auto'>${price}</Col>
                                                        )
                                                    }  
                                                </Row>
                                            ))
                                        }
                                        
                                    </ListGroup.Item>
                                ))
                            }
                        </ListGroup>
                </Card>
            ) }
        </Container>
    );
}

export default PastValues;