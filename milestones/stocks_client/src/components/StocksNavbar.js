import { NavDropdown, Container, Navbar, Nav } from 'react-bootstrap';

function StocksNavbar() {
  return (
    <Navbar expand="lg">
      <Container expand="lg" className=' pb-3 my-2 border-bottom'>
        <Navbar.Brand href="#home">💸 MoneyWings</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#link">Features</Nav.Link>
            <NavDropdown title="About" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">API</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                AlphaVantage
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Capstone Project</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="https://github.com/ricardorompar">
                ricardorompar
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default StocksNavbar;