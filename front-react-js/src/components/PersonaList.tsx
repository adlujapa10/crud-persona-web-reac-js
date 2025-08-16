import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Alert, 
  Badge, 
  InputGroup, 
  Form, 
  Row, 
  Col, 
  Card,
  Modal,
  Spinner
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Persona, Sexo, EstadisticasPersonas } from '../types/Persona';
import { personaService } from '../services/api';

const PersonaList: React.FC = () => {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [estadisticas, setEstadisticas] = useState<EstadisticasPersonas | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [personaToDelete, setPersonaToDelete] = useState<Persona | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    cargarPersonas();
  }, []);

  const cargarPersonas = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [personasData, estadisticasData] = await Promise.all([
        personaService.obtenerTodas(),
        personaService.obtenerEstadisticas()
      ]);
      
      setPersonas(personasData);
      setEstadisticas(estadisticasData);
    } catch (err) {
      setError('Error al cargar las personas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      cargarPersonas();
      return;
    }

    try {
      setLoading(true);
      const resultados = await personaService.buscar(searchTerm);
      setPersonas(resultados);
    } catch (err) {
      setError('Error al buscar personas');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterByRol = async (rol: string) => {
    try {
      setLoading(true);
      const resultados = await personaService.filtrarPorRol(rol);
      setPersonas(resultados);
    } catch (err) {
      setError('Error al filtrar por rol');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterBySexo = async (sexo: string) => {
    try {
      setLoading(true);
      const resultados = await personaService.filtrarPorSexo(sexo);
      setPersonas(resultados);
    } catch (err) {
      setError('Error al filtrar por sexo');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (persona: Persona) => {
    setPersonaToDelete(persona);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!personaToDelete) return;

    try {
      setDeleting(true);
      const response = await personaService.eliminar(personaToDelete.id!);
      
      if (response.success) {
        setPersonas(prev => prev.filter(p => p.id !== personaToDelete.id));
        setShowDeleteModal(false);
        setPersonaToDelete(null);
        
        // Recargar estadísticas
        const nuevasEstadisticas = await personaService.obtenerEstadisticas();
        setEstadisticas(nuevasEstadisticas);
      } else {
        setError(response.mensaje || 'Error al eliminar la persona');
      }
    } catch (err: any) {
      setError(err.response?.data?.mensaje || 'Error al eliminar la persona');
    } finally {
      setDeleting(false);
    }
  };

  const getSexoBadge = (sexo?: Sexo) => {
    if (!sexo) return null;
    
    return sexo === Sexo.M ? (
      <Badge bg="primary">
        <i className="fas fa-mars me-1"></i>
        Masculino
      </Badge>
    ) : (
      <Badge bg="danger">
        <i className="fas fa-venus me-1"></i>
        Femenino
      </Badge>
    );
  };

  const getNombreCompleto = (persona: Persona) => {
    return `${persona.nombre} ${persona.apellido}`;
  };

  if (loading && personas.length === 0) {
    return (
      <div className="container mt-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
        <p className="mt-2">Cargando personas...</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {/* Header */}
      <Row className="mb-4">
        <Col md={6}>
          <h2>
            <i className="fas fa-users me-2"></i>
            Lista de Personas
          </h2>
          <p className="text-muted">Gestiona todos los registros de personas en el sistema</p>
        </Col>
        <Col md={6} className="text-end">
          <Link to="/personas/nueva" className="btn btn-primary">
            <i className="fas fa-plus me-2"></i>
            Nueva Persona
          </Link>
        </Col>
      </Row>

      {/* Mensajes de error */}
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </Alert>
      )}

      {/* Búsqueda y Filtros */}
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={6}>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Buscar por nombre o apellido..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button variant="outline-primary" onClick={handleSearch}>
                  <i className="fas fa-search"></i>
                </Button>
              </InputGroup>
            </Col>
            <Col md={6} className="text-end">
              <div className="btn-group" role="group">
                <Button 
                  variant="outline-info" 
                  size="sm"
                  onClick={() => handleFilterBySexo('M')}
                >
                  <i className="fas fa-mars me-1"></i>
                  Masculino
                </Button>
                <Button 
                  variant="outline-danger" 
                  size="sm"
                  onClick={() => handleFilterBySexo('F')}
                >
                  <i className="fas fa-venus me-1"></i>
                  Femenino
                </Button>
                <Button 
                  variant="outline-success" 
                  size="sm"
                  onClick={() => handleFilterByRol('Cliente')}
                >
                  Clientes
                </Button>
                <Button 
                  variant="outline-warning" 
                  size="sm"
                  onClick={() => handleFilterByRol('Empleado')}
                >
                  Empleados
                </Button>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Tabla de Personas */}
      <Card>
        <Card.Body>
          {personas.length === 0 ? (
            <div className="text-center py-4">
              <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
              <p className="text-muted">No hay personas registradas</p>
              <Link to="/personas/nueva" className="btn btn-primary">
                <i className="fas fa-plus me-2"></i>
                Agregar Primera Persona
              </Link>
            </div>
          ) : (
            <Table responsive striped hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Cédula</th>
                  <th>Teléfono</th>
                  <th>Email</th>
                  <th>Edad</th>
                  <th>Sexo</th>
                  <th>Rol</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {personas.map((persona) => (
                  <tr key={persona.id}>
                    <td>
                      <Badge bg="secondary">{persona.id}</Badge>
                    </td>
                    <td><strong>{persona.nombre}</strong></td>
                    <td>{persona.apellido}</td>
                    <td><code>{persona.cedula}</code></td>
                    <td>
                      {persona.telefono && (
                        <>
                          <i className="fas fa-phone me-1"></i>
                          {persona.telefono}
                        </>
                      )}
                    </td>
                    <td>
                      {persona.email && (
                        <>
                          <i className="fas fa-envelope me-1"></i>
                          {persona.email}
                        </>
                      )}
                    </td>
                    <td>
                      {persona.edad && (
                        <Badge bg="info">{persona.edad} años</Badge>
                      )}
                    </td>
                    <td>{getSexoBadge(persona.sexo)}</td>
                    <td>
                      {persona.rol && (
                        <Badge bg="success">{persona.rol}</Badge>
                      )}
                    </td>
                    <td>
                      <div className="btn-group" role="group">
                        <Link
                          to={`/personas/editar/${persona.id}`}
                          className="btn btn-sm btn-outline-primary"
                          title="Editar"
                        >
                          <i className="fas fa-edit"></i>
                        </Link>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteClick(persona)}
                          title="Eliminar"
                        >
                          <i className="fas fa-trash"></i>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Estadísticas */}
      {estadisticas && (
        <Row className="mt-4">
          <Col md={12}>
            <Card bg="light">
              <Card.Body>
                <Row className="text-center">
                  <Col md={3}>
                    <h4 className="text-primary">{estadisticas.totalPersonas}</h4>
                    <p className="text-muted mb-0">Total de Personas</p>
                  </Col>
                  <Col md={3}>
                    <h4 className="text-success">{estadisticas.personasConEmail}</h4>
                    <p className="text-muted mb-0">Con Email</p>
                  </Col>
                  <Col md={3}>
                    <h4 className="text-info">{estadisticas.personasConTelefono}</h4>
                    <p className="text-muted mb-0">Con Teléfono</p>
                  </Col>
                  <Col md={3}>
                    <h4 className="text-warning">{estadisticas.personasConRol}</h4>
                    <p className="text-muted mb-0">Con Rol</p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Modal de confirmación de eliminación */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar a{' '}
          <strong>{personaToDelete ? getNombreCompleto(personaToDelete) : ''}</strong>?
          <br />
          <small className="text-muted">Esta acción no se puede deshacer.</small>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDeleteConfirm}
            disabled={deleting}
          >
            {deleting ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Eliminando...
              </>
            ) : (
              'Eliminar'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PersonaList;
