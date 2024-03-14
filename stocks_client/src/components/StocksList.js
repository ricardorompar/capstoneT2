import { Card, Row, Col, Badge, Button } from 'react-bootstrap';

function StocksList({list, handleSelectStock}) {
    const handleSelect = async (event) => {
        // event.preventDefault();
        handleSelectStock(event.currentTarget.value);
    }
    return(
        <Col className='d-flex flex-nowrap overflow-x-scroll'>
            {Object.entries(list.portfolio).map(([label, details], id) => (
                <Button key={id} className='m-1 bg-secondary-subtle border-0 text-dark p-0' style={{minWidth:'150px'}} value={label} onClick={handleSelect}>
                    <Card.Header as="h5">{label}</Card.Header>
                    <Row className='p-1'>
                        <Col>
                            <Badge className='fs-6'>{details.num_stocks}</Badge>
                        </Col>
                        <Col className='fs-6 m-auto'>
                            ${details.last_close}
                        </Col>
                    </Row>
                </Button>
            ))}
        </Col>
    )
}

export default StocksList;