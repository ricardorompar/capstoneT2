import { Container, Nav, Col} from 'react-bootstrap';

function StocksFooter({setShowAboutModal}) {
    const aboutClicked = () => setShowAboutModal(true);
    return (
        <Container className='w-100'>
            <footer className="d-flex flex-wrap justify-content-between align-items-center py-5 my-5 border-top">
                <Col className='d-flex align-items-center'>
                    <a href="/" className="d-flex align-items-center justify-content-end link-body-emphasis text-decoration-none fs-2">
                        💸
                    </a>
                    <span className='mb-3 mb-md-0 text-body-secondary'>
                        © {new Date().getFullYear()} <a href='https://github.com/ricardorompar' className='text-decoration-none link-body-emphasis'>ricardorompar</a>
                    </span>
                </Col>
                <Nav className='justify-content-center'>
                    <Nav.Link onClick={aboutClicked} className='link-body-emphasis text-decoration-none'>
                        {/* <a className="nav-link px-2 text-body-secondary" onClick={aboutClicked}>About</a> */}
                        About
                    </Nav.Link>
                </Nav>
            </footer>
        </Container>
    );
}

export default StocksFooter;