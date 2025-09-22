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
  Spinner,
  Dropdown,
  ButtonGroup
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Factura, TipoFactura, EstadoFactura, EstadisticasFacturas } from '../types/Factura';
import { facturaService } from '../services/api';

const FacturaList: React.FC = () => {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [estadisticas, setEstadisticas] = useState<EstadisticasFacturas | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAnularModal, setShowAnularModal] = useState(false);
  const [facturaToDelete, setFacturaToDelete] = useState<Factura | null>(null);
  const [facturaToAnular, setFacturaToAnular] = useState<Factura | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [anulando, setAnulando] = useState(false);
  const [motivoAnulacion, setMotivoAnulacion] = useState('');
  const [selectedTipo, setSelectedTipo] = useState<TipoFactura | 'TODOS'>('TODOS');
  const [selectedEstado, setSelectedEstado] = useState<EstadoFactura | 'TODOS'>('TODOS');

  useEffect(() => {
    cargarFacturas();
  }, []);

  const cargarFacturas = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [facturasData, estadisticasData] = await Promise.all([
        facturaService.obtenerTodas(),
        facturaService.obtenerEstadisticas()
      ]);
      
      setFacturas(facturasData);
      setEstadisticas(estadisticasData);
    } catch (err) {
      setError('Error al cargar las facturas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      cargarFacturas();
      return;
    }

    try {
      setLoading(true);
      const facturasData = await facturaService.buscar(searchTerm);
      setFacturas(facturasData);
    } catch (err) {
      setError('Error al buscar facturas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltrarPorTipo = async (tipo: TipoFactura | 'TODOS') => {
    setSelectedTipo(tipo);
    
    try {
      setLoading(true);
      let facturasData: Factura[];
      
      if (tipo === 'TODOS') {
        facturasData = await facturaService.obtenerTodas();
      } else {
        facturasData = await facturaService.buscarPorTipo(tipo);
      }
      
      setFacturas(facturasData);
    } catch (err) {
      setError('Error al filtrar facturas por tipo');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltrarPorEstado = async (estado: EstadoFactura | 'TODOS') => {
    setSelectedEstado(estado);
    
    try {
      setLoading(true);
      let facturasData: Factura[];
      
      if (estado === 'TODOS') {
        facturasData = await facturaService.obtenerTodas();
      } else {
        facturasData = await facturaService.filtrarPorEstado(estado);
      }
      
      setFacturas(facturasData);
    } catch (err) {
      setError('Error al filtrar facturas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!facturaToDelete) return;

    try {
      setDeleting(true);
      await facturaService.eliminar(facturaToDelete.id!);
      setFacturas(facturas.filter(f => f.id !== facturaToDelete.id));
      setShowDeleteModal(false);
      setFacturaToDelete(null);
      
      // Recargar estadísticas
      const estadisticasData = await facturaService.obtenerEstadisticas();
      setEstadisticas(estadisticasData);
    } catch (err: any) {
      setError(err.response?.data?.mensaje || 'Error al eliminar la factura');
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  const handleAnular = async () => {
    if (!facturaToAnular || !motivoAnulacion.trim()) return;

    try {
      setAnulando(true);
      await facturaService.anular(facturaToAnular.id!, motivoAnulacion);
      
      // Actualizar la factura en la lista
      setFacturas(facturas.map(f => 
        f.id === facturaToAnular.id 
          ? { ...f, estado: EstadoFactura.ANULADA, observaciones: (f.observaciones || '') + ` | ANULADA: ${motivoAnulacion}` }
          : f
      ));
      
      setShowAnularModal(false);
      setFacturaToAnular(null);
      setMotivoAnulacion('');
      
      // Recargar estadísticas
      const estadisticasData = await facturaService.obtenerEstadisticas();
      setEstadisticas(estadisticasData);
    } catch (err: any) {
      setError(err.response?.data?.mensaje || 'Error al anular la factura');
      console.error(err);
    } finally {
      setAnulando(false);
    }
  };

  const handleMarcarComoPagada = async (factura: Factura) => {
    try {
      await facturaService.marcarComoPagada(factura.id!);
      
      // Actualizar la factura en la lista
      setFacturas(facturas.map(f => 
        f.id === factura.id 
          ? { ...f, estado: EstadoFactura.PAGADA }
          : f
      ));
      
      // Recargar estadísticas
      const estadisticasData = await facturaService.obtenerEstadisticas();
      setEstadisticas(estadisticasData);
    } catch (err: any) {
      setError(err.response?.data?.mensaje || 'Error al marcar como pagada');
      console.error(err);
    }
  };

  const getEstadoBadge = (estado: EstadoFactura) => {
    const variants = {
      [EstadoFactura.PENDIENTE]: 'warning',
      [EstadoFactura.PAGADA]: 'success',
      [EstadoFactura.ANULADA]: 'danger',
      [EstadoFactura.VENCIDA]: 'secondary'
    };
    
    const labels = {
      [EstadoFactura.PENDIENTE]: 'Pendiente',
      [EstadoFactura.PAGADA]: 'Pagada',
      [EstadoFactura.ANULADA]: 'Anulada',
      [EstadoFactura.VENCIDA]: 'Vencida'
    };

    return (
      <Badge bg={variants[estado]}>{labels[estado]}</Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
  };

  if (loading && facturas.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <Row className="mb-4">
        <Col>
          <h2>Gestión de Facturas</h2>
          <p className="text-muted">Administra las facturas del sistema</p>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Estadísticas */}
      {estadisticas && (
        <Row className="mb-4">
          <Col md={2}>
            <Card className="text-center">
              <Card.Body>
                <Card.Title className="text-primary">{estadisticas.totalFacturas}</Card.Title>
                <Card.Text>Total Facturas</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={2}>
            <Card className="text-center">
              <Card.Body>
                <Card.Title className="text-success">{estadisticas.totalVentas}</Card.Title>
                <Card.Text>Ventas</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={2}>
            <Card className="text-center">
              <Card.Body>
                <Card.Title className="text-info">{estadisticas.totalCompras}</Card.Title>
                <Card.Text>Compras</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={2}>
            <Card className="text-center">
              <Card.Body>
                <Card.Title className="text-warning">{estadisticas.facturasPendientes}</Card.Title>
                <Card.Text>Pendientes</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={2}>
            <Card className="text-center">
              <Card.Body>
                <Card.Title className="text-success">{estadisticas.facturasPagadas}</Card.Title>
                <Card.Text>Pagadas</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={2}>
            <Card className="text-center">
              <Card.Body>
                <Card.Title className="text-danger">{estadisticas.facturasAnuladas}</Card.Title>
                <Card.Text>Anuladas</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <Card.Title className="text-success">{formatCurrency(estadisticas.totalVentas)}</Card.Title>
                <Card.Text>Total Ventas</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={1}>
            <Card className="text-center">
              <Card.Body>
                <Card.Title className="text-warning">{formatCurrency(estadisticas.totalPendiente)}</Card.Title>
                <Card.Text>Por Cobrar</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Filtros y búsqueda */}
      <Row className="mb-3">
        <Col md={6}>
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Buscar por número, cliente o vendedor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button variant="outline-secondary" onClick={handleSearch}>
              Buscar
            </Button>
          </InputGroup>
        </Col>
        <Col md={2}>
          <Dropdown>
            <Dropdown.Toggle variant="outline-success" id="dropdown-tipo">
              Tipo: {selectedTipo === 'TODOS' ? 'Todos' : selectedTipo === 'VENTA' ? 'Ventas' : 'Compras'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleFiltrarPorTipo('TODOS')}>
                Todos
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleFiltrarPorTipo(TipoFactura.VENTA)}>
                Ventas
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleFiltrarPorTipo(TipoFactura.COMPRA)}>
                Compras
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
        <Col md={2}>
          <Dropdown>
            <Dropdown.Toggle variant="outline-primary" id="dropdown-estado">
              Estado: {selectedEstado === 'TODOS' ? 'Todos' : selectedEstado}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleFiltrarPorEstado('TODOS')}>
                Todos
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleFiltrarPorEstado(EstadoFactura.PENDIENTE)}>
                Pendientes
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleFiltrarPorEstado(EstadoFactura.PAGADA)}>
                Pagadas
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleFiltrarPorEstado(EstadoFactura.ANULADA)}>
                Anuladas
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleFiltrarPorEstado(EstadoFactura.VENCIDA)}>
                Vencidas
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
        <Col md={3} className="text-end">
          <Link to="/facturas/nueva">
            <Button variant="primary">
              Nueva Factura
            </Button>
          </Link>
        </Col>
      </Row>

      {/* Tabla de facturas */}
      <Table responsive striped hover>
        <thead>
          <tr>
            <th>Número</th>
            <th>Fecha</th>
            <th>Tipo</th>
            <th>Cliente/Proveedor</th>
            <th>Vendedor/Responsable</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {facturas.map((factura) => (
            <tr key={factura.id}>
              <td>
                <strong>{factura.numeroFactura}</strong>
              </td>
              <td>{formatDate(factura.fechaFactura)}</td>
              <td>
                <Badge bg={factura.tipo === TipoFactura.VENTA ? 'success' : 'info'}>
                  {factura.tipo === TipoFactura.VENTA ? 'Venta' : 'Compra'}
                </Badge>
              </td>
              <td>
                {factura.cliente?.nombre} {factura.cliente?.apellido}
                <br />
                <small className="text-muted">{factura.cliente?.cedula}</small>
              </td>
              <td>{factura.vendedor?.usuario}</td>
              <td>
                <strong>{formatCurrency(factura.total)}</strong>
              </td>
              <td>{getEstadoBadge(factura.estado)}</td>
              <td>
                <ButtonGroup size="sm">
                  <Link to={`/facturas/editar/${factura.id}`}>
                    <Button variant="outline-primary">
                      Editar
                    </Button>
                  </Link>
                  
                  {factura.estado === EstadoFactura.PENDIENTE && (
                    <Button 
                      variant="outline-success"
                      onClick={() => handleMarcarComoPagada(factura)}
                    >
                      Pagar
                    </Button>
                  )}
                  
                  {factura.estado !== EstadoFactura.ANULADA && factura.estado !== EstadoFactura.PAGADA && (
                    <Button 
                      variant="outline-warning"
                      onClick={() => {
                        setFacturaToAnular(factura);
                        setShowAnularModal(true);
                      }}
                    >
                      Anular
                    </Button>
                  )}
                  
                  {factura.estado !== EstadoFactura.PAGADA && (
                    <Button 
                      variant="outline-danger"
                      onClick={() => {
                        setFacturaToDelete(factura);
                        setShowDeleteModal(true);
                      }}
                    >
                      Eliminar
                    </Button>
                  )}
                </ButtonGroup>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {facturas.length === 0 && !loading && (
        <Alert variant="info" className="text-center">
          No se encontraron facturas
        </Alert>
      )}

      {/* Modal de confirmación de eliminación */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Está seguro de que desea eliminar la factura <strong>{facturaToDelete?.numeroFactura}</strong>?
          <br />
          <small className="text-muted">Esta acción no se puede deshacer.</small>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? <Spinner size="sm" /> : 'Eliminar'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de anulación */}
      <Modal show={showAnularModal} onHide={() => setShowAnularModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Anular Factura</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>¿Está seguro de que desea anular la factura <strong>{facturaToAnular?.numeroFactura}</strong>?</p>
          <Form.Group className="mb-3">
            <Form.Label>Motivo de anulación:</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={motivoAnulacion}
              onChange={(e) => setMotivoAnulacion(e.target.value)}
              placeholder="Ingrese el motivo de la anulación..."
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAnularModal(false)}>
            Cancelar
          </Button>
          <Button 
            variant="warning" 
            onClick={handleAnular} 
            disabled={anulando || !motivoAnulacion.trim()}
          >
            {anulando ? <Spinner size="sm" /> : 'Anular'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default FacturaList;
