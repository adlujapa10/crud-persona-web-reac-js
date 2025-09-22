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
import { Producto, Estado, EstadisticasProductos } from '../types/Producto';
import { productoService } from '../services/api';

const ProductoList: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [estadisticas, setEstadisticas] = useState<EstadisticasProductos | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productoToDelete, setProductoToDelete] = useState<Producto | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [productosData, estadisticasData] = await Promise.all([
        productoService.obtenerTodos(),
        productoService.obtenerEstadisticas()
      ]);
      
      setProductos(productosData);
      setEstadisticas(estadisticasData);
    } catch (err) {
      setError('Error al cargar los productos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      cargarProductos();
      return;
    }

    try {
      setLoading(true);
      const resultados = await productoService.buscar(searchTerm);
      setProductos(resultados);
    } catch (err) {
      setError('Error al buscar productos');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterByEstado = async (estado: string) => {
    try {
      setLoading(true);
      const resultados = await productoService.filtrarPorEstado(estado);
      setProductos(resultados);
    } catch (err) {
      setError('Error al filtrar por estado');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterByCategoria = async (categoria: string) => {
    try {
      setLoading(true);
      const resultados = await productoService.filtrarPorCategoria(categoria);
      setProductos(resultados);
    } catch (err) {
      setError('Error al filtrar por categoría');
    } finally {
      setLoading(false);
    }
  };

  const handleStockBajo = async () => {
    try {
      setLoading(true);
      const resultados = await productoService.obtenerProductosConStockBajo();
      setProductos(resultados);
    } catch (err) {
      setError('Error al obtener productos con stock bajo');
    } finally {
      setLoading(false);
    }
  };

  const handleAgotados = async () => {
    try {
      setLoading(true);
      const resultados = await productoService.obtenerProductosAgotados();
      setProductos(resultados);
    } catch (err) {
      setError('Error al obtener productos agotados');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (producto: Producto) => {
    setProductoToDelete(producto);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productoToDelete) return;

    try {
      setDeleting(true);
      const response = await productoService.eliminar(productoToDelete.id!);
      
      if (response.success) {
        setProductos(prev => prev.filter(p => p.id !== productoToDelete.id));
        setShowDeleteModal(false);
        setProductoToDelete(null);
        
        // Recargar estadísticas
        const nuevasEstadisticas = await productoService.obtenerEstadisticas();
        setEstadisticas(nuevasEstadisticas);
      } else {
        setError(response.mensaje || 'Error al eliminar el producto');
      }
    } catch (err: any) {
      setError(err.response?.data?.mensaje || 'Error al eliminar el producto');
    } finally {
      setDeleting(false);
    }
  };

  const getEstadoBadge = (estado: Estado) => {
    switch (estado) {
      case Estado.ACTIVO:
        return <Badge bg="success">Activo</Badge>;
      case Estado.INACTIVO:
        return <Badge bg="secondary">Inactivo</Badge>;
      case Estado.AGOTADO:
        return <Badge bg="danger">Agotado</Badge>;
      default:
        return <Badge bg="secondary">{estado}</Badge>;
    }
  };

  const getStockBadge = (producto: Producto) => {
    if (producto.stock <= 0) {
      return <Badge bg="danger">Sin Stock</Badge>;
    } else if (producto.stockMinimo && producto.stock <= producto.stockMinimo) {
      return <Badge bg="warning">Stock Bajo</Badge>;
    } else {
      return <Badge bg="success">{producto.stock}</Badge>;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(price);
  };

  if (loading && productos.length === 0) {
    return (
      <div className="container mt-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
        <p className="mt-2">Cargando productos...</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {/* Header */}
      <Row className="mb-4">
        <Col md={6}>
          <h2>
            <i className="fas fa-boxes me-2"></i>
            Lista de Productos
          </h2>
          <p className="text-muted">Gestiona el inventario de productos en el sistema</p>
        </Col>
        <Col md={6} className="text-end">
          <Link to="/productos/nuevo" className="btn btn-primary">
            <i className="fas fa-plus me-2"></i>
            Nuevo Producto
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
                  placeholder="Buscar por nombre, código o descripción..."
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
                  variant="outline-success" 
                  size="sm"
                  onClick={() => handleFilterByEstado('ACTIVO')}
                >
                  <i className="fas fa-check me-1"></i>
                  Activos
                </Button>
                <Button 
                  variant="outline-secondary" 
                  size="sm"
                  onClick={() => handleFilterByEstado('INACTIVO')}
                >
                  <i className="fas fa-pause me-1"></i>
                  Inactivos
                </Button>
                <Button 
                  variant="outline-danger" 
                  size="sm"
                  onClick={() => handleFilterByEstado('AGOTADO')}
                >
                  <i className="fas fa-times me-1"></i>
                  Agotados
                </Button>
                <Button 
                  variant="outline-warning" 
                  size="sm"
                  onClick={handleStockBajo}
                >
                  <i className="fas fa-exclamation-triangle me-1"></i>
                  Stock Bajo
                </Button>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Tabla de Productos */}
      <Card>
        <Card.Body>
          {productos.length === 0 ? (
            <div className="text-center py-4">
              <i className="fas fa-box-open fa-3x text-muted mb-3"></i>
              <p className="text-muted">No hay productos registrados</p>
              <Link to="/productos/nuevo" className="btn btn-primary">
                <i className="fas fa-plus me-2"></i>
                Agregar Primer Producto
              </Link>
            </div>
          ) : (
            <Table responsive striped hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Código</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Categoría</th>
                  <th>Marca</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((producto) => (
                  <tr key={producto.id}>
                    <td>
                      <Badge bg="secondary">{producto.id}</Badge>
                    </td>
                    <td>
                      <div>
                        <strong>{producto.nombre}</strong>
                        {producto.descripcion && (
                          <div className="text-muted small">{producto.descripcion}</div>
                        )}
                      </div>
                    </td>
                    <td><code>{producto.codigo}</code></td>
                    <td>
                      <strong className="text-success">{formatPrice(producto.precio)}</strong>
                    </td>
                    <td>{getStockBadge(producto)}</td>
                    <td>
                      {producto.categoria && (
                        <Badge bg="info">{producto.categoria}</Badge>
                      )}
                    </td>
                    <td>
                      {producto.marca && (
                        <Badge bg="primary">{producto.marca}</Badge>
                      )}
                    </td>
                    <td>{getEstadoBadge(producto.estado)}</td>
                    <td>
                      <div className="btn-group" role="group">
                        <Link
                          to={`/productos/editar/${producto.id}`}
                          className="btn btn-sm btn-outline-primary"
                          title="Editar"
                        >
                          <i className="fas fa-edit"></i>
                        </Link>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteClick(producto)}
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
                  <Col md={2}>
                    <h4 className="text-primary">{estadisticas.totalProductos}</h4>
                    <p className="text-muted mb-0">Total Productos</p>
                  </Col>
                  <Col md={2}>
                    <h4 className="text-success">{estadisticas.productosActivos}</h4>
                    <p className="text-muted mb-0">Activos</p>
                  </Col>
                  <Col md={2}>
                    <h4 className="text-secondary">{estadisticas.productosInactivos}</h4>
                    <p className="text-muted mb-0">Inactivos</p>
                  </Col>
                  <Col md={2}>
                    <h4 className="text-danger">{estadisticas.productosAgotados}</h4>
                    <p className="text-muted mb-0">Agotados</p>
                  </Col>
                  <Col md={2}>
                    <h4 className="text-warning">{estadisticas.productosConStockBajo}</h4>
                    <p className="text-muted mb-0">Stock Bajo</p>
                  </Col>
                  <Col md={2}>
                    <h4 className="text-info">{formatPrice(estadisticas.valorTotalInventario)}</h4>
                    <p className="text-muted mb-0">Valor Inventario</p>
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
          ¿Estás seguro de que deseas eliminar el producto{' '}
          <strong>{productoToDelete?.nombre}</strong>?
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

export default ProductoList;
