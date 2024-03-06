import { Col, Container, Spinner, Table } from 'react-bootstrap';
import React from 'react';

function PastValues({data, timeInt}) {  //this component receives a key as a parameter like AMZN

    var seriesName = "values_"+timeInt; //this name is defined in the flask backend
    return (
        <Container>
            
            {!data ?(
                <Spinner className='my-2 mx-auto' animation="border" />
            ):(
                // new version:
                <>                    
                    <Table responsive hover>
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
                            {/* map here: */}
                            {/* {console.log(`s name: ${seriesName}`)} */}
                            {Object.entries(data[seriesName]).map(([date, values]) =>( //this will map the contents of the json into a ListGroup.item
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
                </>
            ) }
        </Container>
    );
}

export default PastValues;