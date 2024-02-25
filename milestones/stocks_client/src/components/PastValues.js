import {ListGroup, Card, Row, Col, Container, Spinner, Button} from 'react-bootstrap';
import React, { useState, useEffect } from 'react';

function PastValues({data, showPValues}) {  //this component receives a key as a parameter like AMZN

    // const [list, setList] = useState(null);
    // useEffect(()=>{
    //     fetch(`http://localhost:5000/api/portfolio/${key}`)
    //     .then(response => response.json())
    //     .then(list => setList(list))
    //     .catch(error => console.error("Error fetching data: ", error));
    // }, []);


    const list = {
        "symbol": "AMZN",
        "stocks_daily": {  
            "2024-02-22": {
                "1. open": "173.1000",
                "2. high": "174.8000",
                "3. low": "171.7700",
                "4. close": "174.5800",
                "5. volume": "55392354"
            },
            "2024-02-21": {
                "1. open": "168.9400",
                "2. high": "170.2300",
                "3. low": "167.1400",
                "4. close": "168.5900",
                "5. volume": "44575623"
            },
            "2024-02-20": {
                "1. open": "167.8300",
                "2. high": "168.7100",
                "3. low": "165.7400",
                "4. close": "167.0800",
                "5. volume": "41980326"
            }
        }
    }
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
            {/* {!list ? (
                    
                ):(
                    <Card>
                        <Card.Title>{list.symbol}</Card.Title>
                        <ListGroup variant='flush'>
                            {
                                Object.entries(list.values_daily).map(([date, values]) =>( //this will map the contents of the json into a ListGroup.item
                                    <ListGroup.Item key={date}>
                                        <p className='fs-3'>{date}</p>
                                        {   //in this case the value is another object:
                                            Object.entries(values).map(([key, price]) =>(
                                                <Row>
                                                    <Col className='col-auto me-auto'>{key}</Col>
                                                    <Col className='col-auto'>${price}</Col>
                                                </Row>
                                            ))
                                        }
                                        
                                    </ListGroup.Item>
                                ))
                            }
                        </ListGroup>
                    </Card>
                )
            } */}
        </Container>
    );
}

export default PastValues;