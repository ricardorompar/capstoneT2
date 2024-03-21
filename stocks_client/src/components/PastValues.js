import { Col, Container, Spinner, Alert, Row, Table, Card, Form } from 'react-bootstrap';
import React, {useEffect, useState} from 'react';
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

function PastValues({stock, url}) {  //this component receives a key as a parameter like AMZN
    const [details, setDetails] = useState({});
    const [loading, setLoading] = useState(true);
    const [graph, setGraph] = useState(false);

    const loadDetails = async () => {
        setLoading(true);
        try{    //try to send request:
            const response = await fetch(url+`/api/portfolio/${stock}`, {
                method: 'GET',
                mode: 'cors',
                credentials: 'include' // Needed for cookies to be included in the request
            });
            if (response.ok) {
                const data = await response.json();
                setDetails(data);
                setLoading(false);
            }else{
                console.log(response)
            }
        } catch(error){
            console.error("Error fetching data: ", error.message);
        }
    };

    useEffect(()=>{
        loadDetails();
        setGraph(false);
    },[stock])

    const closeOnly = (data) => {
        var transformed = [];
        for (const [date, details] of Object.entries(data)) {
            var entry = {};
            entry.date = date;
            entry.close = details["4. close"];
            transformed = transformed.concat(entry);
        }
        return transformed;
    };

    const changeGraph = () => {setGraph(!graph)};

    return (
        <Container>
            {loading ?(
                <div className='p-1'>
                    <span className='d-flex justify-content-center'>
                        <Spinner animation="border" size='lg' className='m-auto'/>
                    </span>
                </div>
            ):(
                stock?(
                    <Col>  
                        <Row className='d-flex justify-content-center m-2'>
                            <Alert className='fs-6 fw-bold bg-secondary-subtle d-flex justify-content-center p-1' variant='flush' style={{maxWidth:'500px'}}>{details.symbol}</Alert>
                        </Row>
                        <Form>
                            <Row className='d-flex justify-content-center'>
                                <Col xs='auto'>Table</Col>
                                <Col xs='auto'>
                                    <Form.Switch onChange={changeGraph} className='form-switch-lg'></Form.Switch>
                                </Col>
                                <Col xs='auto'>Graph</Col>
                            </Row>
                        </Form>
                        <Card className='m-2' style={{maxHeight:'50vh'}} border='0'>
                            {graph?(
                                <ResponsiveContainer width={"100%"} height={400} className='p-1 m-auto'>
                                    <AreaChart width={300} height={400} data={closeOnly(details.values_daily)} margin={{ top: 5, right: 0, bottom: 10, left: 0 }}>
                                        <defs>
                                            <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
                                        <XAxis dataKey="date" height={40}/>
                                        <YAxis dataKey="close" domain={['auto', 'auto']}/>
                                        <Tooltip />
                                        <Area type="monotone" dataKey="close" stroke="#82ca9d" fillOpacity={1} fill="url(#colorPv)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ):(
                                <Table hover responsive className='overflow-x-scroll mt-3'>
                                    <thead>
                                        <tr>
                                            <th>Time/date</th>
                                            <th>Open</th>
                                            <th>High</th>
                                            <th>Low</th>
                                            <th>Close</th>
                                            <th>Volume</th>
                                        </tr>
                                    </thead>
                                    
                                    <tbody>
                                        {Object.entries(details.values_daily).map(([date, values]) =>( //this will map the contents of the json into a ListGroup.item
                                            <tr key={date}>
                                                
                                                <td>{date}</td>
                                                {   //in this case the value is another object:
                                                    Object.entries(values).map(([key, price]) =>(
                                                    <td key={key}>
                                                        {(key==="5. volume")?(    //if the value is the volume i dont want the dollar sign
                                                            <Col className='col-auto'>{price}</Col>
                                                        ):(
                                                            <Col className='col-auto'>${price}</Col>
                                                        )}
                                                    </td>
                                                    ))
                                                }
                                            
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )} {/* End if graph */}
                        </Card>
                    </Col>
                ):(
                    <></>
                )
            ) }
        </Container>
    );
}

export default PastValues;