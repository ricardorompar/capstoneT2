import { Container, Nav, Col} from 'react-bootstrap';

function StocksFooter() {
  return (
    <Container>
        <footer className="d-flex flex-wrap justify-content-between align-items-center py-5 my-5 border-top">
            <Col className='d-flex align-items-center'>
                <span className='mb-3 mb-md-0 text-body-secondary'>
                    © {new Date().getFullYear()} ricardorompar
                </span>
                <a href="/" className="col-md-4 d-flex align-items-center justify-content-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none fs-2">
                    💸
                </a>
            </Col>
            <Nav className='justify-content-center'>
                <Nav.Item>  {/*React-Bootstrap is pretty amazing*/}
                    <a href="example.com" className="nav-link px-2 text-body-secondary">Home</a>
                </Nav.Item>
                <Nav.Item>
                    <a href="#action" className="nav-link px-2 text-body-secondary">Features</a>
                </Nav.Item>
                <Nav.Item>
                    <a href="#action2" className="nav-link px-2 text-body-secondary">FAQs</a>
                </Nav.Item>
                <Nav.Item>
                    <a href="#action3" className="nav-link px-2 text-body-secondary">About</a>
                </Nav.Item>
            </Nav>
        </footer>
    </Container>
  );
}

export default StocksFooter;