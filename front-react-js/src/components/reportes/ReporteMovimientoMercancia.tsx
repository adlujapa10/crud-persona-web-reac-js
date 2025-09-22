import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Card,
  Button,
  Form,
  Alert,
  Table,
  Badge,
  Spinner
} from 'react-bootstrap';
import { reporteService } from '../../services/api';
import { ReporteMovimientoMercancia as ReporteMovimientoMercanciaType } from '../../types/Reportes';

/**
 * Componente para reporte de movimiento de mercancía
 */
const ReporteMovimientoMercancia: React.FC = () => {
  const [movimientos, setMovimientos] = useState<ReporteMovimientoMercanciaType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fechaInicio, setFechaInicio] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [fechaFin, setFechaFin] = useState(new Date().toISOString().split('T')[0]);
  const [totalMovimientos, setTotalMovimientos] = useState(0);

  // Cargar reporte inicial
  useEffect(() => {
    cargarMovimientos();
  }, []);

  const cargarMovimientos = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await reporteService.obtenerMovimientoMercancia(fechaInicio, fechaFin);
      setMovimientos(data.movimientos);
      setTotalMovimientos(data.totalMovimientos);
    } catch (err: any) {
      setError('Error al cargar movimiento de mercancía: ' + (err.message || 'Error desconocido'));
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getVariacionColor = (variacion: number) => {
    if (variacion > 0) return 'success';
    if (variacion < 0) return 'danger';
    return 'secondary';
  };

  const getVariacionIcon = (variacion: number) => {
    if (variacion > 0) return 'fas fa-arrow-up';
    if (variacion < 0) return 'fas fa-arrow-down';
    return 'fas fa-minus';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO');
  };

  return (
    <div>
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-filter me-2"></i>
                Filtros del Reporte
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={3}>
                  <Form.Label>Fecha Inicio:</Form.Label>
                  <Form.Control
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                  />
                </Col>
                <Col md={3}>
                  <Form.Label>Fecha Fin:</Form.Label>
                  <Form.Control
                    type="date"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                  />
                </Col>
                <Col md={3} className="d-flex align-items-end">
                  <Button 
                    variant="primary" 
                    onClick={cargarMovimientos}
                    disabled={loading}
                    className="w-100"
                  >
                    {loading ? (
                      <>
                        <Spinner size="sm" className="me-2" />
                        Cargando...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-search me-2"></i>
                        Generar Reporte
                      </>
                    )}
                  </Button>
                </Col>
                <Col md={3} className="d-flex align-items-end">
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => {
                      const hoy = new Date();
                      const hace30Dias = new Date(hoy.getTime() - 30 * 24 * 60 * 60 * 1000);
                      setFechaInicio(hace30Dias.toISOString().split('T')[0]);
                      setFechaFin(hoy.toISOString().split('T')[0]);
                    }}
                    className="w-100"
                  >
                    <i className="fas fa-calendar-week me-2"></i>
                    Últimos 30 días
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" className="mb-4">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </Alert>
      )}

      {/* Resumen */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-chart-line me-2"></i>
                Resumen del Período
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={3}>
                  <div className="text-center">
                    <h4 className="text-primary">{totalMovimientos}</h4>
                    <p className="text-muted mb-0">Productos con Movimiento</p>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center">
                    <h4 className="text-info">{formatDate(fechaInicio)}</h4>
                    <p className="text-muted mb-0">Fecha Inicio</p>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center">
                    <h4 className="text-info">{formatDate(fechaFin)}</h4>
                    <p className="text-muted mb-0">Fecha Fin</p>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center">
                    <h4 className="text-success">
                      {movimientos.filter(m => m.variacionStock > 0).length}
                    </h4>
                    <p className="text-muted mb-0">Productos con Aumento</p>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tabla de movimientos */}
      {movimientos.length > 0 ? (
        <Row>
          <Col>
            <Card>
              <Card.Header>
                <h5 className="mb-0">
                  <i className="fas fa-boxes me-2"></i>
                  Movimiento de Mercancía
                </h5>
              </Card.Header>
              <Card.Body>
                <Table responsive striped hover>
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Stock Inicial</th>
                      <th>Cantidad Vendida</th>
                      <th>Cantidad Comprada</th>
                      <th>Stock Final</th>
                      <th>Variación</th>
                    </tr>
                  </thead>
                  <tbody>
                    {movimientos.map((movimiento, index) => (
                      <tr key={index}>
                        <td>
                          <strong>{movimiento.nombreProducto}</strong>
                        </td>
                        <td>
                          <Badge bg="secondary">{movimiento.stockInicial}</Badge>
                        </td>
                        <td>
                          <Badge bg="danger">{movimiento.cantidadVendida}</Badge>
                        </td>
                        <td>
                          <Badge bg="success">{movimiento.cantidadComprada}</Badge>
                        </td>
                        <td>
                          <Badge bg="info">{movimiento.stockFinal}</Badge>
                        </td>
                        <td>
                          <Badge bg={getVariacionColor(movimiento.variacionStock)}>
                            <i className={`${getVariacionIcon(movimiento.variacionStock)} me-1`}></i>
                            {movimiento.variacionStock > 0 ? '+' : ''}{movimiento.variacionStock}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ) : (
        <Alert variant="info" className="text-center">
          <i className="fas fa-info-circle me-2"></i>
          No se encontraron movimientos de mercancía para el período seleccionado.
        </Alert>
      )}

      {/* Gráfico de resumen */}
      {movimientos.length > 0 && (
        <Row className="mt-4">
          <Col>
            <Card>
              <Card.Header>
                <h5 className="mb-0">
                  <i className="fas fa-chart-bar me-2"></i>
                  Análisis de Variaciones
                </h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={4}>
                    <div className="text-center p-3 bg-light rounded">
                      <h3 className="text-success">
                        {movimientos.filter(m => m.variacionStock > 0).length}
                      </h3>
                      <p className="mb-0">Productos con Aumento de Stock</p>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="text-center p-3 bg-light rounded">
                      <h3 className="text-danger">
                        {movimientos.filter(m => m.variacionStock < 0).length}
                      </h3>
                      <p className="mb-0">Productos con Disminución de Stock</p>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="text-center p-3 bg-light rounded">
                      <h3 className="text-secondary">
                        {movimientos.filter(m => m.variacionStock === 0).length}
                      </h3>
                      <p className="mb-0">Productos sin Cambio</p>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default ReporteMovimientoMercancia;
