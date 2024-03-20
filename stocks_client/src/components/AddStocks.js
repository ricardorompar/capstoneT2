import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Alert, Row, Badge } from 'react-bootstrap';

function AddStocks({user, innerText, currentValues, changeModif, handleReload}) {
    //Stuff for modal:
    const [show, setShow] = useState(false);
    const handleClose = () => {
        setShow(false);
        setMessage(null);
    }
    function handleShow(){
        setShow(true);
        setStock(null);
        setQuant(0);
        setDisable(true);
    }

    //For modifying stocks:
    const [stock, setStock] = useState(null);
    const [quant, setQuant] = useState(0)
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
    const [action, setAction] = useState('Add/Modify Stocks')
    const [message, setMessage] = useState(null);
    const [modification, setModification] = useState(null);

    function handleSubmit(){
        changeModif(JSON.stringify(modification));
        handleClose();
        handleReload();
    };

    useEffect(() => {
        if(stock){
            if(stock!=="Select stock"){
                setDisable(false)
                if (stock in currentValues){
                    setAction(`Modify ${stock}`);
                    //if action is modify, then:
                    var delta = currentValues[stock].num_stocks - quant;
                    if (delta<0){
                        setMessage(`This will add ${Math.abs(delta)} stocks for ${stock}`)
                        setModification({"action":"modify", "user":user, "symbol":stock, "quantity":quant})
                    }else if (delta>0){
                        setMessage(`This will subtract ${Math.abs(delta)} stocks from ${stock}`)
                        setModification({"action":"modify", "user":user, "symbol":stock, "quantity":quant})
                    }else if (delta==0){
                        setDisable(true)
                        setMessage(`This will not change your portfolio`)
                    }
                    if (!quant){
                        setMessage(`This will remove ${stock} from your portfolio`)
                        setAction(`Remove ${stock}`)
                        setModification({"action":"remove", "user":user, "symbol":stock, "quantity":quant})
                    }
                }else{
                    if (quant){
                        setAction(`Add ${stock}`)
                        setMessage(`This will add ${Math.abs(quant)} stocks for ${stock}`)
                        setModification({"action":"add", "user":user, "symbol":stock, "quantity":quant})
                    }else{
                        setMessage(`Increase number of stocks`)
                        setDisable(true)
                    }
                }
            }else{
                setDisable(true);
                setAction("Select stock");
            }
        }else{
            setAction('Add/Modify Stocks');
        }
    }, [stock, quant]); 

    const handleStockChange = (event) => {
        setStock(event.target.value);
    };

    const handleQuantChange = (event) => {
        var newQuant = parseInt(event.target.value, 10);
        if (newQuant<0){
            setMessage("Please use positive numbers only");
            setDisable(true);
        }else{
            setQuant(newQuant);
        }
        
    };

    return(
        <div className='p-2 d-flex justify-content-center'>
            <Button variant="success" className='w-100' onClick={handleShow} style={{maxWidth:'500px'}}>
                {innerText}
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{innerText}</Modal.Title>
                </Modal.Header>
                <Modal.Body className='m-auto w-75'>
                    <Form>
                        <Row>
                            <Form.Label> Select stock symbol</Form.Label>
                            <Form.Select className="form-select" aria-label="Default select example" aria-placeholder='STOCK' onChange={handleStockChange}>
                                <option>Select stock</option>
                                {stockSymbols.map((ticker) =>( 
                                    <option key={ticker}>{ticker}</option>
                                ))}
                            </Form.Select>
                        </Row>
                        <Row className='mt-2'>
                            <Form.Label> Select new stock quantity</Form.Label>
                            <Form.Control type="number" min='0' step='1' onChange={handleQuantChange}></Form.Control>  
                        </Row>
                        <Row className='text-secondary mt-3' style={{fontSize:'12px'}}>If you already have stocks with this symbol, this will overwrite the existing value.</Row>
                        <Row>
                            <Alert variant='secondary' className='mt-3'>
                                {
                                    !disable?(
                                        <>
                                            {(stock in currentValues)?(
                                                <p><b>{stock}</b>: you currently have <Badge>{currentValues[stock].num_stocks}</Badge></p>
                                            ):(
                                                <p><b>{stock}</b>: you don't have any stocks</p>
                                            )}
                                        </>
                                    ):(
                                        <p>Select stock</p>
                                    )
                                }
                                {message}
                            </Alert>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSubmit} disabled={disable}>
                        {action}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
export default AddStocks;
