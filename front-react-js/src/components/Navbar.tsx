import React from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const NavigationBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const usuario = authService.obtenerUsuario();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

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
            
            {/* Dropdown del usuario */}
            <NavDropdown 
              title={
                <span>
                  <i className="fas fa-user-circle me-1"></i>
                  {usuario?.nombreCompleto || 'Usuario'}
                </span>
              } 
              id="user-dropdown"
              className="text-light"
            >
              <NavDropdown.Item disabled>
                <i className="fas fa-user me-2"></i>
                {usuario?.usuario}
              </NavDropdown.Item>
              {usuario?.rol && (
                <NavDropdown.Item disabled>
                  <i className="fas fa-briefcase me-2"></i>
                  {usuario.rol}
                </NavDropdown.Item>
              )}
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>
                <i className="fas fa-sign-out-alt me-2"></i>
                Cerrar Sesión
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
