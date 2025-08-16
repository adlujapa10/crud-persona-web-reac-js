import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const NavigationBar: React.FC = () => {
  const location = useLocation();

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <i className="fas fa-users me-2"></i>
          Sistema CRM
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/" active={location.pathname === '/'}>
              <i className="fas fa-home me-1"></i>
              Inicio
            </Nav.Link>
            <Nav.Link as={Link} to="/personas" active={location.pathname === '/personas'}>
              <i className="fas fa-list me-1"></i>
              Personas
            </Nav.Link>
            <Nav.Link as={Link} to="/personas/nueva" active={location.pathname === '/personas/nueva'}>
              <i className="fas fa-plus me-1"></i>
              Nueva Persona
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
