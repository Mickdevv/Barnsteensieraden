import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { LinkContainer } from "react-router-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { NavDropdown } from "react-bootstrap";
import SearchBox from './SearchBox'
import { logout } from "../actions/userActions";

function Header() {
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const logoutHandler = () => {
    dispatch(logout());
  };

  return (
    <header>
      <Navbar expand="lg" className="bg-dark" data-bs-theme="dark">
        <Container className="d-flex justify-content-between">

          <LinkContainer to="/">
            <Navbar.Brand>Barnsteensieraden</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            
            <Nav className="ml-auto d-flex justify-content-between">
              

              {userInfo && userInfo.isAdmin && (
                <NavDropdown title="Admin" id="adminmenu">
                  <LinkContainer to="/admin/users">
                    <NavDropdown.Item>Manage users</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/products">
                    <NavDropdown.Item>Manage products</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/orders">
                    <NavDropdown.Item>Manage orders</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}

              
              {userInfo ? (
                <NavDropdown title={userInfo.name} id="username">
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to="/login">
                  <Nav.Link>
                    <i className="fas fa-user" /> Login
                  </Nav.Link>
                </LinkContainer>
              )}
              <LinkContainer to="/cart">
                <Nav.Link>
                  <i className="fas fa-shopping-cart" /> Cart
                </Nav.Link>
              </LinkContainer>
              
              <div className="search-container">
                <SearchBox />
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}

export default Header;
