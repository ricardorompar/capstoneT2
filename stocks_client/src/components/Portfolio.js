import {Spinner, Alert, Container, Row, Col, Card, Badge} from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import ListComponent from './ListComponent';
import PastValues from './PastValues';
import AddStocks from './AddStocks';
import { PieChart } from '@mui/x-charts/PieChart';

function Portfolio({user}) {
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
    const url = "http://127.0.0.1:5000/api/portfolio";
    var interval = "daily"  //for the new version

    useEffect(()=>{
        async function loadList(){
        //This function defines the first request that this component makes when it renders after login.
            try{    //try to send request:
                const response = await fetch(url+`?user=${user}`, {
                    method: 'GET',
                    mode: 'cors',
                    credentials: 'include' // Needed for cookies to be included in the request
                });
                console.log("message from loadList")
                if (response.ok) {
                    const data = await response.json()
                    console.log(data)  //debugging
                    setList(data)
                }else{
                    console.log(response)
                }
            } catch(error){
                console.error("Error fetching data: ", error.message);
            }
        };
        loadList();
    }, [user]);
    
    
    return (
        <Container className='d-flex flex-column justify-content-center mt-3 mx-0'>
            <span className='m-auto' style={{width:'70%', minWidth: '300px', maxWidth:'800px'}}>
                {list?( //if the list has loaded:
                    JSON.stringify(list.portfolio)==='{}'?(    //if the portfolio is empty:
                        <Alert variant='secondary' className='p-4'>
                            <Row className='mb-3 justify-content-center'>You don't have any stocks yet.</Row>
                            <Row>
                                <AddStocks user={user} innerText={'Click here to add stocks!'}></AddStocks>
                            </Row>
                        </Alert>
                    ):( //else all the data:
                            <Card className='p-0'>
                                <Row className='m-0'>
                                    <Card.Header className='fs-5'>Your portfolio</Card.Header>
                                    <Col className='p-3' style={{maxHeight:'200px', minWidth:'250px'}}>
                                        <PieChart
                                            series={[
                                                {data: Object.entries(list.portfolio)
                                                    .map(([label, details], id) => (
                                                    {id, value: details.num_stocks,label}
                                                ))},
                                            ]}
                                            //width={300}
                                            height={200}
                                            className='p-3 border mb-3'
                                        />
                                    </Col>
                                    <Col className='p-3 d-flex align-items-center justify-content-center'>
                                        <div className='d-flex flex-column align-items-center'>
                                            <Card.Text className='mt-3'>Your total portfolio value</Card.Text>
                                            <Badge className='fs-4 bg-secondary m-auto'>${list.total_port_val}</Badge>
                                        </div>
                                    </Col>
                                </Row>
                                <Row className='mt-5'>
                                    <Col md={5}>
                                        Stocks list goes here
                                        <ul>
                                            {Object.entries(list.portfolio).map(([label, details], id) => (
                                                    <li>
                                                        {label}:{details.num_stocks}/${details.last_close}
                                                    </li>
                                                ))}
                                        </ul>
                                        <AddStocks user={user} innerText={'Add/Modify stocks'}></AddStocks>
                                    </Col>
                                    <Col>
                                        detailed values of stock go here
                                    </Col>
                                </Row>
                            </Card>
                    )
                ):( //else a spinner:
                    <div className='p-5'>
                        <span className='d-flex justify-content-center'>
                            <Spinner animation="border" size='lg' className='m-auto'/>
                        </span>
                    </div>
                )}
            </span>
            {/* <Card className='p-3 my-2 m-auto'>
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
                                //<ListComponent key={itemKey} itemKey={itemKey} itemValue={itemValue} onSelectStock={handleSelection}></ListComponent>
                                <ListComponent key={itemKey} itemKey={itemKey} itemValue={itemValue}></ListComponent>
                            ))
                        )}
                    </ListGroup>
                </Offcanvas.Body>
            </Offcanvas> */}
            
        </Container>    
    );
}

export default Portfolio;