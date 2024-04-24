import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { LinkContainer } from 'react-router-bootstrap'

function Header() {
    return (
        <header>
            <Navbar expand="lg" className="bg-primary" data-bs-theme="dark">
                <Container>
                    <LinkContainer to="/">
                        <Navbar.Brand>Barnsteensieraden</Navbar.Brand>
                    </LinkContainer>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="ml-auto">
                            <LinkContainer to="/cart">
                                <Nav.Link><i className='fas fa-shopping-cart'/> Cart</Nav.Link>
                            </LinkContainer>

                            <LinkContainer to="/login">    
                                <Nav.Link><i className='fas fa-user'/> Login</Nav.Link>
                            </LinkContainer>
                            </Nav>
                        </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    );
  }

export default Header
