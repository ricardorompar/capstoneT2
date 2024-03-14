import { Col, Container, Spinner, Alert, Row, Table } from 'react-bootstrap';
import React, {useEffect, useState} from 'react';

function PastValues({stock, url}) {  //this component receives a key as a parameter like AMZN
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    async function loadDetails(){
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
    },[stock])

    const closeOnly = (data) => {
        const transformed = {};
        for (const [date, details] of Object.entries(data)) {
            transformed[date] = details["4. close"];
        }
        return transformed;
    };

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
                        <Row className='d-flex justify-content-center'>
                            <Alert className='fs-6 fw-bold bg-secondary-subtle d-flex justify-content-center p-0 w-75' variant='flush'>{details.symbol}</Alert>
                        </Row>
                        <Table hover responsive className='overflow-x-scroll'>
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
                    </Col>
                ):(
                    <></>
                )
            ) }
        </Container>
    );
}

export default PastValues;