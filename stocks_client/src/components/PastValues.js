import { Col, Container, Spinner, Table } from 'react-bootstrap';
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
                console.log(data) ; //debugging
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
    return (
        <Container>
            {loading ?(
                <Spinner className='my-2 mx-auto' animation="border" />
            ):( 
                <>               
                    {JSON.stringify(details)}
                </> 
            ) }
        </Container>
    );
}

export default PastValues;