// import {ListGroup, Card, Container, Spinner, Button} from 'react-bootstrap';
import {Offcanvas, Button, ListGroup, Spinner, ButtonGroup, 
        Container, Row, Badge, Card, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import ListComponent from './ListComponent';
import PastValues from './PastValues';

function StocksList() {
    const [list, setList] = useState(null);
    const [selectedStock, setSelectedStock] = useState(null);
    const [selectedInterval, setSelectedInterval] = useState("daily");
    // this is for the offcanvas:
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    //This is for showing past values
    const [showPValues, setShowPValues] = useState(false);
    const [pastData, setPastData] = useState(null);

    //for retrieving portfolio:
    const userId = "user1";
    //const url = `https://mcsbt-integration-rickyr.nw.r.appspot.com/api/portfolio?userId=${userId}`;
    const url = `http://127.0.0.1:5000/api/portfolio?userId=${userId}`;

    //for stock info:
    //const url2 = "https://mcsbt-integration-rickyr.nw.r.appspot.com/api/portfolio/";
    const url2 = "http://127.0.0.1:5000/api/portfolio/";
    var interval = "daily"  //for the new version

    useEffect(()=>{
        fetch(url, {method:"GET", mode:"cors"})
        .then(response => response.json())
        .then(list => setList(list))
        .catch(error => console.error("Error fetching data: ", error));
        }, [url]);

    // useEffect(()=>{
        
    //     const fetchData = async (itemKey) => {
    //         try {
    //             const response = await fetch(url2 + itemKey, { method: "GET", mode: "cors" });
    //             const pastData = await response.json();
    //             setShowPValues(true);
    //             setPastData(pastData);
                
    //         } catch (error) {
    //             console.error("Error fetching data: ", error);
    //         }
    //     };
    //     fetchData();
    // },[]);

    const handleSelection = (itemKey) => {
        setShowPValues(false);
        fetch(url2+itemKey, {method:"GET", mode:"cors"})    //i am not yet defining the query params. all defaults
            .then(response => response.json())
            .then(data => setPastData(data))
            .catch(error => console.error("Error fetching data: ", error));
        setShowPValues(true);
        handleClose();
        setSelectedStock(itemKey);
        
    };
    //pd this was very complicated and frustrating!!
    const handleTimeSelection = (event) => {
        var buttonValue = event.target.value;
        setSelectedInterval(buttonValue);
        
    };

    return (
        <Container className='center-content min-vh-100 mt-3 w-75 m-auto' style={{ minWidth: '300px' }}>
            <Card className='p-3 my-2 m-auto'>
                <Row>
                    <Col>
                        Welcome,
                        <Card.Title className='fs-2'>{userId}</Card.Title>
                    </Col>
                    <Col className='d-flex justify-content-end'>
                        <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Log in/out will be implemented in next Milestone</Tooltip>}>
                            <div style={{ height: '100%', display: 'flex', alignItems: 'stretch' }}>
                                <Button disabled style={{ pointerEvents: 'none' }} variant='outline-secondary'>
                                    Logout
                                </Button>
                            </div>
                        </OverlayTrigger>
                    </Col>
                </Row>
            </Card>

            <Card className='px-5 py-3 my-2'>
                <Row className='m-auto mb-3'>
                    <p className='mt-3 m-auto fs-5'>TOTAL PORTFOLIO VALUE</p>
                </Row>
                <Row>
                    <>
                        {!list?(
                            <Spinner animation="border" className='m-auto'/>
                        ):(
                            <Badge bg='dark' text='light' className='fs-3 m-auto w-75'>
                                <p className='m-2'>
                                    ${list.total_port_val}
                                </p>
                            </Badge>
                        )}
                    </>
                </Row>
            </Card>
            
            <Card className='p-5 my-2'>
                <Row>
                    <Button variant="outline-secondary" onClick={handleShow} className='w-75 m-auto fs-4'>
                        Choose Stock
                    </Button>
                </Row>
                
                <Row className='m-auto mt-3'>
                    {showPValues &&     //this toggles visualization
                        <>
                            {/* unfortunately this is not ready yet: */}
                            {false&&<Row className='my-3'>  
                                <p>
                                    Select time series: {selectedInterval}
                                </p>
                                <ButtonGroup aria-label="Basic example" onClick={handleTimeSelection}>
                                    <Button variant="secondary" value="monthly">Monthly</Button>
                                    <Button variant="secondary" value="weekly">Weekly</Button>
                                    <Button variant="secondary" value="daily">Daily</Button>
                                    <Button variant="secondary" value="min60">Hourly</Button>
                                    <Button variant="secondary" value="min5">5 minutes</Button>
                                    <Button variant="secondary" value="min1">1 minute</Button>
                                </ButtonGroup>
                            </Row>}
                            <p className='fs-3 fw-3'>{selectedStock}</p>
                            <PastValues data={pastData} timeInt={interval} className='m-auto mt-3'/>
                        </>
                    }
                </Row>
            </Card>

            <Offcanvas show={show} onHide={handleClose}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title className='fs-3'>Stocks List</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <p>
                        Select a stock ticker to access past values.
                    </p>
                    <ListGroup variant='flush'>
                        {!list ? (
                            <Spinner className='my-5 mx-auto' animation="border" />
                        ):(
                            Object.entries(list.portfolio).map(([itemKey, itemValue]) =>( //this will map the contents of the json into a ListGroup.item
                                <ListComponent key={itemKey} itemKey={itemKey} itemValue={itemValue} onSelectStock={handleSelection}></ListComponent>
                            ))
                        )}
                    </ListGroup>
                </Offcanvas.Body>
            </Offcanvas>
            
        </Container>    
    );
}

export default StocksList;