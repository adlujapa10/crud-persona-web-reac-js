import React, { useState } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Tab, 
  Nav,
  Alert
} from 'react-bootstrap';

// Componentes de reportes
import ReporteVentasCompras from './reportes/ReporteVentasCompras';
import ReporteMovimientoMercancia from './reportes/ReporteMovimientoMercancia';
import ReporteAlertasInventario from './reportes/ReporteAlertasInventario';

/**
 * Componente principal del módulo de Reportes
 */
const Reportes: React.FC = () => {
  const [activeTab, setActiveTab] = useState('ventas-compras');

  return (
    <Container fluid className="py-4">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="display-6 text-primary mb-2">
                <i className="fas fa-chart-line me-3"></i>
                Reportes del Sistema
              </h1>
              <p className="text-muted mb-0">
                Análisis detallado de ventas, compras, inventario y movimientos
              </p>
            </div>
          </div>

          <Alert variant="info" className="mb-4">
            <i className="fas fa-info-circle me-2"></i>
            <strong>Información:</strong> Los reportes se generan en tiempo real basándose en los datos actuales del sistema.
          </Alert>

          <Card>
            <Card.Body>
              <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k || 'ventas-compras')}>
                <Nav variant="tabs" className="mb-4">
                  <Nav.Item>
                    <Nav.Link eventKey="ventas-compras">
                      <i className="fas fa-exchange-alt me-2"></i>
                      Ventas y Compras
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="movimiento-mercancia">
                      <i className="fas fa-boxes me-2"></i>
                      Movimiento de Mercancía
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="alertas-inventario">
                      <i className="fas fa-exclamation-triangle me-2"></i>
                      Alertas de Inventario
                    </Nav.Link>
                  </Nav.Item>
                </Nav>

                <Tab.Content>
                  <Tab.Pane eventKey="ventas-compras">
                    <ReporteVentasCompras />
                  </Tab.Pane>
                  <Tab.Pane eventKey="movimiento-mercancia">
                    <ReporteMovimientoMercancia />
                  </Tab.Pane>
                  <Tab.Pane eventKey="alertas-inventario">
                    <ReporteAlertasInventario />
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Reportes;
