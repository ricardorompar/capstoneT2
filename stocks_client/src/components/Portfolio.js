import {Spinner, Alert, Container, Row, Col, Card, Badge} from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import ListComponent from './ListComponent';
import PastValues from './PastValues';
import AddStocks from './AddStocks';
import { PieChart } from '@mui/x-charts/PieChart';
import StocksList from './StocksList';

function Portfolio({user, list, changeModif, loading, handleReload, url}) {
    const [selectedStock, setSelectedStock] = useState(null);
    const [selectedInterval, setSelectedInterval] = useState("daily");

    //This is for showing past values
    const [showPValues, setShowPValues] = useState(false);
    const [pastData, setPastData] = useState(null);    

    const handleSelectStock = (stock) => {
        setSelectedStock(stock);
    }
    
    return (
        <Container className='d-flex flex-column justify-content-center mt-3 mx-0'>
            <span className='m-auto' style={{width:'70%', minWidth: '360px', maxWidth:'800px'}}>
                {list?( //if the list has loaded:
                    JSON.stringify(list.portfolio)==='{}'?(    //if the portfolio is empty:
                        <Alert variant='secondary' className='p-4'>
                            <Row className='mb-3 justify-content-center'>You don't have any stocks yet.</Row>
                            <Row>
                                <AddStocks user={user} innerText={'Add stocks!'} currentValues={list.portfolio}></AddStocks>
                            </Row>
                        </Alert>
                    ):( //else all the data:
                            <Card className='p-0'>
                                <Row className='m-0'>
                                    <Card.Header className='fs-5'>Your portfolio</Card.Header>
                                    {loading&&<div className='p-1'>
                                        <span className='d-flex justify-content-center'>
                                            <Spinner animation="border" size='lg' className='m-auto'/>
                                        </span>
                                    </div>}
                                    <Col className='p-3' style={{ minWidth:'250px'}}>
                                        <PieChart
                                            series={[
                                                {data: Object.entries(list.portfolio)
                                                    .map(([label, details], id) => (
                                                    {id, value: details.num_stocks,label}
                                                ))},
                                            ]}
                                            margin={{ top: 10, bottom: 10, left: 10, right:100 }}
                                            slotProps={{
                                                legend: {
                                                // direction: 'row',
                                                itemMarkWidth: 20,
                                                itemMarkHeight: 2,
                                                markGap: 5,
                                                itemGap: 10,
                                                }
                                            }}
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
                                <Row className='mt-4 px-3'>
                                    <h5>Your list of stocks</h5>
                                    <StocksList list={list} handleSelectStock={handleSelectStock}></StocksList>
                                    <AddStocks user={user} innerText={'Add/Modify stocks'} currentValues={list.portfolio} changeModif={changeModif} handleReload={handleReload}></AddStocks>
                                </Row>
                                <Row>
                                    <PastValues stock={selectedStock} url={url}></PastValues>
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
        </Container>    
    );
}

export default Portfolio;