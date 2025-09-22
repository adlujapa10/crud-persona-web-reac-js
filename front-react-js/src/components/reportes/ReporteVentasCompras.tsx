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
  Spinner,
  ButtonGroup
} from 'react-bootstrap';
import { reporteService } from '../../services/api';
import { ReporteVentasCompras as ReporteVentasComprasType } from '../../types/Reportes';
import { TipoFactura } from '../../types/Factura';

/**
 * Componente para reporte de ventas y compras
 */
const ReporteVentasCompras: React.FC = () => {
  const [reporte, setReporte] = useState<ReporteVentasComprasType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tipoReporte, setTipoReporte] = useState<'dia' | 'mes'>('dia');
  const [filtroTipo, setFiltroTipo] = useState<TipoFactura | 'TODOS'>('TODOS');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [año, setAño] = useState(new Date().getFullYear());
  const [mes, setMes] = useState(new Date().getMonth() + 1);

  // Cargar reporte inicial
  useEffect(() => {
    if (tipoReporte === 'dia') {
      cargarReporteDiario();
    } else {
      cargarReporteMensual();
    }
  }, []);

  const cargarReporteDiario = async () => {
    setLoading(true);
    setError('');
    try {
      const reporteData = await reporteService.obtenerVentasComprasDiario(fecha);
      setReporte(reporteData);
    } catch (err: any) {
      setError('Error al cargar reporte del día: ' + (err.message || 'Error desconocido'));
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const cargarReporteMensual = async () => {
    setLoading(true);
    setError('');
    try {
      const reporteData = await reporteService.obtenerVentasComprasMensual(año, mes);
      setReporte(reporteData);
    } catch (err: any) {
      setError('Error al cargar reporte mensual: ' + (err.message || 'Error desconocido'));
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTipoReporteChange = (tipo: 'dia' | 'mes') => {
    setTipoReporte(tipo);
    setError('');
    if (tipo === 'dia') {
      cargarReporteDiario();
    } else {
      cargarReporteMensual();
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO');
  };

  // Filtrar datos según el filtro seleccionado
  const getVentasFiltradas = () => {
    if (filtroTipo === 'TODOS' || filtroTipo === TipoFactura.VENTA) {
      return reporte?.ventas || [];
    }
    return [];
  };

  const getComprasFiltradas = () => {
    if (filtroTipo === 'TODOS' || filtroTipo === TipoFactura.COMPRA) {
      return reporte?.compras || [];
    }
    return [];
  };

  const getTotalVentasFiltrado = () => {
    if (filtroTipo === 'TODOS' || filtroTipo === TipoFactura.VENTA) {
      return reporte?.totalVentas || 0;
    }
    return 0;
  };

  const getTotalComprasFiltrado = () => {
    if (filtroTipo === 'TODOS' || filtroTipo === TipoFactura.COMPRA) {
      return reporte?.totalCompras || 0;
    }
    return 0;
  };

  const getCantidadVentasFiltrada = () => {
    if (filtroTipo === 'TODOS' || filtroTipo === TipoFactura.VENTA) {
      return reporte?.cantidadVentas || 0;
    }
    return 0;
  };

  const getCantidadComprasFiltrada = () => {
    if (filtroTipo === 'TODOS' || filtroTipo === TipoFactura.COMPRA) {
      return reporte?.cantidadCompras || 0;
    }
    return 0;
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
                <Col md={2}>
                  <Form.Label>Tipo de Reporte:</Form.Label>
                  <ButtonGroup className="w-100">
                    <Button
                      variant={tipoReporte === 'dia' ? 'primary' : 'outline-primary'}
                      onClick={() => handleTipoReporteChange('dia')}
                    >
                      Día
                    </Button>
                    <Button
                      variant={tipoReporte === 'mes' ? 'primary' : 'outline-primary'}
                      onClick={() => handleTipoReporteChange('mes')}
                    >
                      Mes
                    </Button>
                  </ButtonGroup>
                </Col>
                
                <Col md={2}>
                  <Form.Label>Filtrar por:</Form.Label>
                  <ButtonGroup className="w-100">
                    <Button
                      variant={filtroTipo === 'TODOS' ? 'success' : 'outline-success'}
                      onClick={() => setFiltroTipo('TODOS')}
                    >
                      Todos
                    </Button>
                    <Button
                      variant={filtroTipo === TipoFactura.VENTA ? 'success' : 'outline-success'}
                      onClick={() => setFiltroTipo(TipoFactura.VENTA)}
                    >
                      Ventas
                    </Button>
                    <Button
                      variant={filtroTipo === TipoFactura.COMPRA ? 'success' : 'outline-success'}
                      onClick={() => setFiltroTipo(TipoFactura.COMPRA)}
                    >
                      Compras
                    </Button>
                  </ButtonGroup>
                </Col>
                
                {tipoReporte === 'dia' ? (
                  <Col md={2}>
                    <Form.Label>Fecha:</Form.Label>
                    <Form.Control
                      type="date"
                      value={fecha}
                      onChange={(e) => setFecha(e.target.value)}
                    />
                  </Col>
                ) : (
                  <>
                    <Col md={1}>
                      <Form.Label>Año:</Form.Label>
                      <Form.Control
                        type="number"
                        min="2020"
                        max="2030"
                        value={año}
                        onChange={(e) => setAño(parseInt(e.target.value))}
                      />
                    </Col>
                    <Col md={1}>
                      <Form.Label>Mes:</Form.Label>
                      <Form.Select value={mes} onChange={(e) => setMes(parseInt(e.target.value))}>
                        <option value={1}>Enero</option>
                        <option value={2}>Febrero</option>
                        <option value={3}>Marzo</option>
                        <option value={4}>Abril</option>
                        <option value={5}>Mayo</option>
                        <option value={6}>Junio</option>
                        <option value={7}>Julio</option>
                        <option value={8}>Agosto</option>
                        <option value={9}>Septiembre</option>
                        <option value={10}>Octubre</option>
                        <option value={11}>Noviembre</option>
                        <option value={12}>Diciembre</option>
                      </Form.Select>
                    </Col>
                  </>
                )}
                
                <Col md={2} className="d-flex align-items-end">
                  <Button 
                    variant="primary" 
                    onClick={tipoReporte === 'dia' ? cargarReporteDiario : cargarReporteMensual}
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

      {reporte && (
        <>
          {/* Resumen */}
          <Row className="mb-4">
            {(filtroTipo === 'TODOS' || filtroTipo === TipoFactura.VENTA) && (
              <Col md={filtroTipo === 'TODOS' ? 6 : 12}>
                <Card className="h-100">
                <Card.Header className="bg-success text-white">
                  <h5 className="mb-0">
                    <i className="fas fa-arrow-up me-2"></i>
                    Ventas
                  </h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col>
                      <h3 className="text-success">{getCantidadVentasFiltrada()}</h3>
                      <p className="text-muted mb-0">Cantidad de Ventas</p>
                    </Col>
                    <Col>
                      <h3 className="text-success">{formatCurrency(getTotalVentasFiltrado())}</h3>
                      <p className="text-muted mb-0">Total Vendido</p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
              </Col>
            )}
            {(filtroTipo === 'TODOS' || filtroTipo === TipoFactura.COMPRA) && (
              <Col md={filtroTipo === 'TODOS' ? 6 : 12}>
                <Card className="h-100">
                <Card.Header className="bg-info text-white">
                  <h5 className="mb-0">
                    <i className="fas fa-arrow-down me-2"></i>
                    Compras
                  </h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col>
                      <h3 className="text-info">{getCantidadComprasFiltrada()}</h3>
                      <p className="text-muted mb-0">Cantidad de Compras</p>
                    </Col>
                    <Col>
                      <h3 className="text-info">{formatCurrency(getTotalComprasFiltrado())}</h3>
                      <p className="text-muted mb-0">Total Comprado</p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
              </Col>
            )}
          </Row>

          {/* Detalle de Ventas */}
          {getVentasFiltradas().length > 0 && (
            <Row className="mb-4">
              <Col>
                <Card>
                  <Card.Header>
                    <h5 className="mb-0">
                      <i className="fas fa-shopping-cart me-2"></i>
                      Detalle de Ventas - {reporte.periodo}
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <Table responsive striped hover>
                      <thead>
                        <tr>
                          <th>Número</th>
                          <th>Fecha</th>
                          <th>Cliente</th>
                          <th>Vendedor</th>
                          <th>Total</th>
                          <th>Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getVentasFiltradas().map((venta: any) => (
                          <tr key={venta.id}>
                            <td><strong>{venta.numeroFactura}</strong></td>
                            <td>{formatDate(venta.fechaFactura)}</td>
                            <td>
                              {venta.cliente?.nombre} {venta.cliente?.apellido}
                              <br />
                              <small className="text-muted">{venta.cliente?.cedula}</small>
                            </td>
                            <td>{venta.vendedor?.usuario}</td>
                            <td><strong>{formatCurrency(venta.total)}</strong></td>
                            <td>
                              <Badge bg={
                                venta.estado === 'PAGADA' ? 'success' :
                                venta.estado === 'PENDIENTE' ? 'warning' :
                                venta.estado === 'ANULADA' ? 'danger' : 'secondary'
                              }>
                                {venta.estado}
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
          )}

          {/* Detalle de Compras */}
          {getComprasFiltradas().length > 0 && (
            <Row>
              <Col>
                <Card>
                  <Card.Header>
                    <h5 className="mb-0">
                      <i className="fas fa-shopping-bag me-2"></i>
                      Detalle de Compras - {reporte.periodo}
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <Table responsive striped hover>
                      <thead>
                        <tr>
                          <th>Número</th>
                          <th>Fecha</th>
                          <th>Proveedor</th>
                          <th>Responsable</th>
                          <th>Total</th>
                          <th>Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getComprasFiltradas().map((compra: any) => (
                          <tr key={compra.id}>
                            <td><strong>{compra.numeroFactura}</strong></td>
                            <td>{formatDate(compra.fechaFactura)}</td>
                            <td>
                              {compra.cliente?.nombre} {compra.cliente?.apellido}
                              <br />
                              <small className="text-muted">{compra.cliente?.cedula}</small>
                            </td>
                            <td>{compra.vendedor?.usuario}</td>
                            <td><strong>{formatCurrency(compra.total)}</strong></td>
                            <td>
                              <Badge bg={
                                compra.estado === 'PAGADA' ? 'success' :
                                compra.estado === 'PENDIENTE' ? 'warning' :
                                compra.estado === 'ANULADA' ? 'danger' : 'secondary'
                              }>
                                {compra.estado}
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
          )}

          {/* Mensaje si no hay datos */}
          {getVentasFiltradas().length === 0 && getComprasFiltradas().length === 0 && (
            <Alert variant="info" className="text-center">
              <i className="fas fa-info-circle me-2"></i>
              {filtroTipo === TipoFactura.VENTA 
                ? 'No se encontraron ventas para el período seleccionado.'
                : filtroTipo === TipoFactura.COMPRA
                ? 'No se encontraron compras para el período seleccionado.'
                : 'No se encontraron ventas ni compras para el período seleccionado.'
              }
            </Alert>
          )}
        </>
      )}
    </div>
  );
};

export default ReporteVentasCompras;
