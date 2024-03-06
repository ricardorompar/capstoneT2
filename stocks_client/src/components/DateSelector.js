import {Col, Form, Row, Button} from "react-bootstrap";

function DateSelector(){
    return(
        <Form>
            <Row>
                <Col>
                    <Form.Group controlId="start" className="mb-3">
                        <Form.Label>Start Date</Form.Label>
                        <Form.Control type="date" />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="end" className="mb-3">
                        <Form.Label>End Date</Form.Label>
                        <Form.Control type="date" />
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Button variant="outline-primary" className='m-auto fs-4' style={{width:'10vh'}}>
                    Go
                </Button>
            </Row>
        </Form>
    )
    
}

export default DateSelector;