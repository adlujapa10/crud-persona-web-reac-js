import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { EstadisticasPersonas } from '../types/Persona';
import { personaService } from '../services/api';

const Home: React.FC = () => {
  const [estadisticas, setEstadisticas] = useState<EstadisticasPersonas | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      const data = await personaService.obtenerEstadisticas();
      setEstadisticas(data);
    } catch (err) {
      setError('Error al cargar las estadísticas');
      console.error(err);
    }
  };

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="text-center mb-5">
        <h1 className="display-4">
          <i className="fas fa-users text-primary me-3"></i>
          Sistema CRM
        </h1>
        <p className="lead text-muted">
          Gestión integral de personas y contactos empresariales
        </p>
        <div className="mt-4">
          <Link to="/personas" className="btn btn-primary btn-lg me-3">
            <i className="fas fa-list me-2"></i>
            Ver Personas
          </Link>
          <Link to="/personas/nueva" className="btn btn-success btn-lg">
            <i className="fas fa-plus me-2"></i>
            Nueva Persona
          </Link>
        </div>
      </div>

      {/* Mensajes de error */}
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </Alert>
      )}

      {/* Estadísticas */}
      {estadisticas && (
        <Row className="mb-5">
          <Col md={3}>
            <Card className="text-center border-primary">
              <Card.Body>
                <i className="fas fa-users fa-3x text-primary mb-3"></i>
                <h3 className="text-primary">{estadisticas.totalPersonas}</h3>
                <p className="text-muted mb-0">Total de Personas</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center border-success">
              <Card.Body>
                <i className="fas fa-envelope fa-3x text-success mb-3"></i>
                <h3 className="text-success">{estadisticas.personasConEmail}</h3>
                <p className="text-muted mb-0">Con Email</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center border-info">
              <Card.Body>
                <i className="fas fa-phone fa-3x text-info mb-3"></i>
                <h3 className="text-info">{estadisticas.personasConTelefono}</h3>
                <p className="text-muted mb-0">Con Teléfono</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center border-warning">
              <Card.Body>
                <i className="fas fa-user-tag fa-3x text-warning mb-3"></i>
                <h3 className="text-warning">{estadisticas.personasConRol}</h3>
                <p className="text-muted mb-0">Con Rol</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Características */}
      <Row className="mb-5">
        <Col md={12}>
          <h2 className="text-center mb-4">
            <i className="fas fa-star text-warning me-2"></i>
            Características Principales
          </h2>
        </Col>
        <Col md={4}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <i className="fas fa-user-plus fa-2x text-primary mb-3"></i>
              <h5>Gestión de Personas</h5>
              <p className="text-muted">
                Crea, edita y elimina registros de personas con información completa
                incluyendo datos personales y de contacto.
              </p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <i className="fas fa-search fa-2x text-success mb-3"></i>
              <h5>Búsqueda Avanzada</h5>
              <p className="text-muted">
                Busca personas por nombre o apellido y filtra por diferentes
                criterios como sexo, rol y más.
              </p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <i className="fas fa-chart-bar fa-2x text-info mb-3"></i>
              <h5>Estadísticas</h5>
              <p className="text-muted">
                Visualiza estadísticas en tiempo real sobre el total de personas
                y su información de contacto.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Acciones Rápidas */}
      <Row>
        <Col md={12}>
          <Card className="bg-light">
            <Card.Body>
              <h4 className="text-center mb-4">
                <i className="fas fa-bolt text-warning me-2"></i>
                Acciones Rápidas
              </h4>
              <Row className="text-center">
                <Col md={3}>
                  <Link to="/personas/nueva" className="btn btn-outline-primary w-100 mb-2">
                    <i className="fas fa-plus me-2"></i>
                    Agregar Persona
                  </Link>
                </Col>
                <Col md={3}>
                  <Link to="/personas" className="btn btn-outline-success w-100 mb-2">
                    <i className="fas fa-list me-2"></i>
                    Ver Lista
                  </Link>
                </Col>
                <Col md={3}>
                  <Button variant="outline-info" className="w-100 mb-2" disabled>
                    <i className="fas fa-download me-2"></i>
                    Exportar
                  </Button>
                </Col>
                <Col md={3}>
                  <Button variant="outline-warning" className="w-100 mb-2" disabled>
                    <i className="fas fa-cog me-2"></i>
                    Configuración
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Footer */}
      <div className="text-center mt-5">
        <p className="text-muted">
          <i className="fas fa-code me-2"></i>
          Desarrollado con React.js y TypeScript
        </p>
        <small className="text-muted">
          Sistema CRM - Gestión de Personas
        </small>
      </div>
    </div>
  );
};

export default Home;
