import React, { useState } from 'react';
import { Button, Modal, Form, Col, Row } from 'react-bootstrap';

function AddStocks({user, logUserOut, innerText}) {
    //Stuff for modal:
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    //For modifying stocks:
    const [stock, setStock] = useState(null);
    const [quant, setQuant] = useState(null)
    //List of possible stocks to add:
    const stockSymbols = [
        "MSFT", "AAPL", "NVDA", "AMZN", "GOOGL", "GOOG", "META", "AVGO", "TSLA", "ASML",
        "AMD", "COST", "NFLX", "ADBE", "PEP", "AZN", "CSCO", "TMUS", "QCOM", "INTC",
        "INTU", "AMAT", "CMCSA", "TXN", "AMGN", "PDD", "ISRG", "HON", "LRCX", "BKNG",
        "MU", "VRTX", "REGN", "ABNB", "SBUX", "ADP", "ADI", "MDLZ", "KLAC", "GILD",
        "PANW", "SNPS", "CDNS", "CRWD", "MELI", "CSX", "MAR", "WDAY", "MRVL", "NXPI",
        "ORLY", "CTAS", "PYPL", "MNST", "PCAR", "ROP", "LULU", "FTNT", "TEAM", "CEG",
        "ADSK", "DASH", "CPRT", "DXCM", "ROST", "MCHP", "IDXX", "ODFL", "AEP", "PAYX",
        "FAST", "GEHC", "KHC", "CHTR", "KDP", "DDOG", "TTD", "MRNA", "CTSH", "EXC",
        "EA", "CSGP"
    ];
    const [disable, setDisable] = useState(true);
    const [message, setMessage] = useState(null)
    // const [validated, setValidated] = useState(false); //for validating form:
    // const [loading, setLoading] = useState(false);
    // const [requestStatus, setRequestStatus] = useState('')

    function handleSubmit(){
        handleClose();
    };

    function checkEnable(){
        if (stock && quant && stock!="Stock" && quant!=0){ //if no stock or quant
                setDisable(false);
        }else{
            setDisable(true);
        }
    }

    const handleStockChange = (event) => {
        setStock(event.target.value);
        checkEnable();
    };
    const handleQuantChange = (event) => {
        setQuant(event.target.value);
        checkEnable();
    };

    return(
        <>
            <Button variant="outline-success" className='w-50 m-auto' onClick={handleShow}>
                {innerText}
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add/Modify stocks</Modal.Title>
                </Modal.Header>
                <Modal.Body className='m-auto w-75'>
                    <Form>
                        <Row>
                            <Form.Label> Select stock symbol</Form.Label>
                            <Form.Select aria-label="Default select example" aria-placeholder='STOCK' size='lg' onChange={handleStockChange}>
                                <option>Stock</option>
                                {stockSymbols.map((ticker) =>( 
                                    <option key={ticker}>{ticker}</option>
                                ))}
                            </Form.Select>
                        </Row>
                        <Row className='mt-2'>
                            <Form.Label> Select stock quantity</Form.Label>
                            <Form.Control type="number" size='lg' min='0' step='1' onChange={handleQuantChange}></Form.Control>
                        </Row>
                        <Row className='text-secondary mt-3' style={{fontSize:'12px'}}>If you already have stocks with this symbol, this will overwrite the existing value.</Row>
                        <p>{user} {stock} {quant} </p>
                    </Form>
                </Modal.Body>
                {message}
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSubmit} disabled={disable}>
                        Add new stocks
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
export default AddStocks;
