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
import { Usuario, EstadisticasUsuarios } from '../types/Usuario';
import { usuarioService } from '../services/api';

const UsuarioList: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [estadisticas, setEstadisticas] = useState<EstadisticasUsuarios | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [usuarioToDelete, setUsuarioToDelete] = useState<Usuario | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [usuariosData, estadisticasData] = await Promise.all([
        usuarioService.obtenerTodos(),
        usuarioService.obtenerEstadisticas()
      ]);
      
      setUsuarios(usuariosData);
      setEstadisticas(estadisticasData);
    } catch (err) {
      setError('Error al cargar los usuarios');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      cargarUsuarios();
      return;
    }

    try {
      setLoading(true);
      const resultados = await usuarioService.buscar(searchTerm);
      setUsuarios(resultados);
    } catch (err) {
      setError('Error al buscar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (usuario: Usuario) => {
    setUsuarioToDelete(usuario);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!usuarioToDelete) return;

    try {
      setDeleting(true);
      await usuarioService.eliminar(usuarioToDelete.id);
      
      // Actualizar la lista
      setUsuarios(prev => prev.filter(u => u.id !== usuarioToDelete.id));
      setShowDeleteModal(false);
      setUsuarioToDelete(null);
      
      // Recargar estadísticas
      const nuevasEstadisticas = await usuarioService.obtenerEstadisticas();
      setEstadisticas(nuevasEstadisticas);
    } catch (err) {
      setError('Error al eliminar el usuario');
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
          <p className="mt-2">Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>
            <i className="fas fa-users text-primary me-2"></i>
            Gestión de Usuarios
          </h2>
          <p className="text-muted">Administra los usuarios del sistema</p>
        </div>
        <Link to="/usuarios/nuevo" className="btn btn-success">
          <i className="fas fa-plus me-2"></i>
          Nuevo Usuario
        </Link>
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
        <Row className="mb-4">
          <Col md={3}>
            <Card className="text-center border-primary">
              <Card.Body>
                <i className="fas fa-users fa-2x text-primary mb-2"></i>
                <h4 className="text-primary">{estadisticas.totalUsuarios}</h4>
                <p className="text-muted mb-0">Total de Usuarios</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center border-success">
              <Card.Body>
                <i className="fas fa-user-check fa-2x text-success mb-2"></i>
                <h4 className="text-success">{estadisticas.usuariosActivos}</h4>
                <p className="text-muted mb-0">Usuarios Activos</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center border-warning">
              <Card.Body>
                <i className="fas fa-user-times fa-2x text-warning mb-2"></i>
                <h4 className="text-warning">{estadisticas.usuariosInactivos}</h4>
                <p className="text-muted mb-0">Usuarios Inactivos</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center border-info">
              <Card.Body>
                <i className="fas fa-search fa-2x text-info mb-2"></i>
                <h4 className="text-info">{usuarios.length}</h4>
                <p className="text-muted mb-0">Mostrados</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Búsqueda */}
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={8}>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Buscar usuarios por nombre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <Button variant="outline-secondary" onClick={handleSearch}>
                  <i className="fas fa-search"></i>
                </Button>
              </InputGroup>
            </Col>
            <Col md={4} className="text-end">
              <Button 
                variant="outline-primary" 
                onClick={cargarUsuarios}
                disabled={loading}
              >
                <i className="fas fa-refresh me-2"></i>
                Actualizar
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Tabla de usuarios */}
      <Card>
        <Card.Body>
          <Table responsive striped hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuario</th>
                <th>Nombre Completo</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-muted">
                    <i className="fas fa-inbox fa-2x mb-2"></i>
                    <br />
                    No se encontraron usuarios
                  </td>
                </tr>
              ) : (
                usuarios.map((usuario) => (
                  <tr key={usuario.id}>
                    <td>{usuario.id}</td>
                    <td>
                      <strong>{usuario.usuario}</strong>
                    </td>
                    <td>{usuario.persona ? `${usuario.persona.nombre} ${usuario.persona.apellido}` : 'Sin persona'}</td>
                    <td>
                      {usuario.persona?.email ? (
                        <a href={`mailto:${usuario.persona.email}`}>{usuario.persona.email}</a>
                      ) : (
                        <span className="text-muted">No especificado</span>
                      )}
                    </td>
                    <td>
                      <Badge bg="info">{usuario.persona?.rol || 'Usuario'}</Badge>
                    </td>
                    <td>
                      <div className="btn-group" role="group">
                        <Link 
                          to={`/usuarios/editar/${usuario.id}`}
                          className="btn btn-sm btn-outline-primary"
                          title="Editar"
                        >
                          <i className="fas fa-edit"></i>
                        </Link>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteClick(usuario)}
                          title="Eliminar"
                        >
                          <i className="fas fa-trash"></i>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Modal de confirmación de eliminación */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-exclamation-triangle text-warning me-2"></i>
            Confirmar Eliminación
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar al usuario{' '}
          <strong>{usuarioToDelete?.usuario}</strong>?
          <br />
          <small className="text-muted">
            Esta acción no se puede deshacer.
          </small>
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
              <>
                <i className="fas fa-trash me-2"></i>
                Eliminar
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UsuarioList;
