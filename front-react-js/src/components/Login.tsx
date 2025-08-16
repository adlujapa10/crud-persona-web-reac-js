import React, { useState } from 'react';
import { Form, Button, Card, Alert, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { LoginRequest } from '../types/Usuario';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState<LoginRequest>({
    usuario: '',
    contrasena: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error cuando el usuario empiece a escribir
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!credentials.usuario.trim() || !credentials.contrasena.trim()) {
      setError('Por favor complete todos los campos');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await authService.login(credentials);
      
      if (response.success && response.usuario) {
        // Guardar usuario en localStorage
        authService.guardarUsuario(response.usuario);
        
        // Redirigir a la página principal
        navigate('/personas');
      } else {
        setError(response.mensaje || 'Error en la autenticación');
      }
    } catch (err: any) {
      console.error('Error en login:', err);
      setError(err.response?.data?.mensaje || 'Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <Row className="w-100 justify-content-center">
        <Col xs={12} sm={8} md={6} lg={4}>
          <Card className="shadow-lg border-0">
            <Card.Body className="p-5">
              {/* Header */}
              <div className="text-center mb-4">
                <div className="mb-3">
                  <i className="fas fa-user-circle fa-3x text-primary"></i>
                </div>
                <h3 className="fw-bold text-dark">Iniciar Sesión</h3>
                <p className="text-muted">Ingresa tus credenciales para acceder al sistema</p>
              </div>

              {/* Mensaje de error */}
              {error && (
                <Alert variant="danger" dismissible onClose={() => setError('')}>
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  {error}
                </Alert>
              )}

              {/* Formulario */}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <i className="fas fa-user me-2"></i>
                    Usuario
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="usuario"
                    value={credentials.usuario}
                    onChange={handleInputChange}
                    placeholder="Ingresa tu nombre de usuario"
                    required
                    autoFocus
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>
                    <i className="fas fa-lock me-2"></i>
                    Contraseña
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="contrasena"
                    value={credentials.contrasena}
                    onChange={handleInputChange}
                    placeholder="Ingresa tu contraseña"
                    required
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 mb-3"
                  disabled={loading}
                  size="lg"
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin me-2"></i>
                      Iniciando sesión...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-sign-in-alt me-2"></i>
                      Iniciar Sesión
                    </>
                  )}
                </Button>
              </Form>

              {/* Footer */}
              <div className="text-center mt-4">
                <small className="text-muted">
                  Sistema de Gestión CRM
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
