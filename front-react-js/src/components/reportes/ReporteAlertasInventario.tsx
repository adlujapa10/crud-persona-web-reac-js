import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Card,
  Button,
  Alert,
  Table,
  Badge,
  Spinner,
  ProgressBar
} from 'react-bootstrap';
import { reporteService } from '../../services/api';
import { ReporteAlertaInventario as ReporteAlertaInventarioType, ResumenAlertas } from '../../types/Reportes';

/**
 * Componente para reporte de alertas de inventario
 */
const ReporteAlertasInventario: React.FC = () => {
  const [alertas, setAlertas] = useState<ReporteAlertaInventarioType[]>([]);
  const [resumen, setResumen] = useState<ResumenAlertas>({ criticas: 0, altas: 0, medias: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [totalAlertas, setTotalAlertas] = useState(0);

  // Cargar alertas al montar el componente
  useEffect(() => {
    cargarAlertas();
  }, []);

  const cargarAlertas = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await reporteService.obtenerAlertasInventario();
      setAlertas(data.alertas);
      setResumen(data.resumen);
      setTotalAlertas(data.totalAlertas);
    } catch (err: any) {
      setError('Error al cargar alertas de inventario: ' + (err.message || 'Error desconocido'));
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getSeveridadColor = (severidad: string) => {
    switch (severidad) {
      case 'CRITICA': return 'danger';
      case 'ALTA': return 'warning';
      case 'MEDIA': return 'info';
      default: return 'secondary';
    }
  };

  const getSeveridadIcon = (severidad: string) => {
    switch (severidad) {
      case 'CRITICA': return 'fas fa-exclamation-triangle';
      case 'ALTA': return 'fas fa-exclamation-circle';
      case 'MEDIA': return 'fas fa-info-circle';
      default: return 'fas fa-question-circle';
    }
  };

  const getTipoAlertaColor = (tipo: string) => {
    switch (tipo) {
      case 'FALTANTE': return 'danger';
      case 'STOCK_BAJO': return 'warning';
      case 'STOCK_MEDIO': return 'info';
      default: return 'secondary';
    }
  };

  const getTipoAlertaText = (tipo: string) => {
    switch (tipo) {
      case 'FALTANTE': return 'Sin Stock';
      case 'STOCK_BAJO': return 'Stock Bajo';
      case 'STOCK_MEDIO': return 'Stock Medio';
      default: return tipo;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
  };

  const calcularPorcentajeStock = (stockActual: number, stockSugerido: number) => {
    if (stockSugerido === 0) return 0;
    return Math.min((stockActual / stockSugerido) * 100, 100);
  };

  return (
    <div>
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-refresh me-2"></i>
                Actualizar Alertas
              </h5>
            </Card.Header>
            <Card.Body>
              <Button 
                variant="primary" 
                onClick={cargarAlertas}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Actualizando...
                  </>
                ) : (
                  <>
                    <i className="fas fa-sync-alt me-2"></i>
                    Actualizar Alertas
                  </>
                )}
              </Button>
              <small className="text-muted ms-3">
                Las alertas se generan automáticamente basándose en el stock actual de los productos.
              </small>
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

      {/* Resumen de alertas */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center border-danger">
            <Card.Body>
              <i className="fas fa-exclamation-triangle fa-2x text-danger mb-2"></i>
              <h3 className="text-danger">{resumen.criticas}</h3>
              <p className="text-muted mb-0">Alertas Críticas</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-warning">
            <Card.Body>
              <i className="fas fa-exclamation-circle fa-2x text-warning mb-2"></i>
              <h3 className="text-warning">{resumen.altas}</h3>
              <p className="text-muted mb-0">Alertas Altas</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-info">
            <Card.Body>
              <i className="fas fa-info-circle fa-2x text-info mb-2"></i>
              <h3 className="text-info">{resumen.medias}</h3>
              <p className="text-muted mb-0">Alertas Medias</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-primary">
            <Card.Body>
              <i className="fas fa-boxes fa-2x text-primary mb-2"></i>
              <h3 className="text-primary">{totalAlertas}</h3>
              <p className="text-muted mb-0">Total Alertas</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tabla de alertas */}
      {alertas.length > 0 ? (
        <Row>
          <Col>
            <Card>
              <Card.Header>
                <h5 className="mb-0">
                  <i className="fas fa-list me-2"></i>
                  Detalle de Alertas de Inventario
                </h5>
              </Card.Header>
              <Card.Body>
                <Table responsive striped hover>
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Stock Actual</th>
                      <th>Stock Sugerido</th>
                      <th>Progreso</th>
                      <th>Tipo de Alerta</th>
                      <th>Severidad</th>
                      <th>Mensaje</th>
                      <th>Precio Unitario</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alertas.map((alerta, index) => (
                      <tr key={index}>
                        <td>
                          <strong>{alerta.nombreProducto}</strong>
                        </td>
                        <td>
                          <Badge bg={alerta.stockActual === 0 ? 'danger' : 'info'}>
                            {alerta.stockActual}
                          </Badge>
                        </td>
                        <td>
                          <Badge bg="secondary">{alerta.stockSugerido}</Badge>
                        </td>
                        <td>
                          <div style={{ width: '100px' }}>
                            <ProgressBar
                              now={calcularPorcentajeStock(alerta.stockActual, alerta.stockSugerido)}
                              variant={alerta.stockActual === 0 ? 'danger' : 
                                      alerta.stockActual <= 5 ? 'warning' : 'success'}
                              label={`${Math.round(calcularPorcentajeStock(alerta.stockActual, alerta.stockSugerido))}%`}
                            />
                          </div>
                        </td>
                        <td>
                          <Badge bg={getTipoAlertaColor(alerta.tipoAlerta)}>
                            {getTipoAlertaText(alerta.tipoAlerta)}
                          </Badge>
                        </td>
                        <td>
                          <Badge bg={getSeveridadColor(alerta.severidad)}>
                            <i className={`${getSeveridadIcon(alerta.severidad)} me-1`}></i>
                            {alerta.severidad}
                          </Badge>
                        </td>
                        <td>
                          <small className="text-muted">{alerta.mensaje}</small>
                        </td>
                        <td>
                          <strong>{formatCurrency(alerta.precioUnitario)}</strong>
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
        <Alert variant="success" className="text-center">
          <i className="fas fa-check-circle me-2"></i>
          ¡Excelente! No hay alertas de inventario. Todos los productos tienen stock suficiente.
        </Alert>
      )}

      {/* Recomendaciones */}
      {alertas.length > 0 && (
        <Row className="mt-4">
          <Col>
            <Card>
              <Card.Header>
                <h5 className="mb-0">
                  <i className="fas fa-lightbulb me-2"></i>
                  Recomendaciones
                </h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  {resumen.criticas > 0 && (
                    <Col md={4}>
                      <Alert variant="danger">
                        <h6><i className="fas fa-exclamation-triangle me-2"></i>Críticas ({resumen.criticas})</h6>
                        <p className="mb-0">Productos sin stock. Reabastecer inmediatamente para evitar pérdida de ventas.</p>
                      </Alert>
                    </Col>
                  )}
                  {resumen.altas > 0 && (
                    <Col md={4}>
                      <Alert variant="warning">
                        <h6><i className="fas fa-exclamation-circle me-2"></i>Altas ({resumen.altas})</h6>
                        <p className="mb-0">Stock muy bajo. Planificar compras en los próximos días.</p>
                      </Alert>
                    </Col>
                  )}
                  {resumen.medias > 0 && (
                    <Col md={4}>
                      <Alert variant="info">
                        <h6><i className="fas fa-info-circle me-2"></i>Medias ({resumen.medias})</h6>
                        <p className="mb-0">Stock medio. Considerar reabastecimiento en el próximo período.</p>
                      </Alert>
                    </Col>
                  )}
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default ReporteAlertasInventario;
