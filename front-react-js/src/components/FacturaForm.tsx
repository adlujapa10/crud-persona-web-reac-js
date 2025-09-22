import React, { useState, useEffect, ChangeEvent } from 'react';
import { 
  Form, 
  Button, 
  Card, 
  Alert, 
  Row, 
  Col, 
  Table,
  Modal,
  Spinner,
  Badge,
  InputGroup
} from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Factura, 
  DetalleFactura, 
  TipoFactura,
  EstadoFactura, 
  FacturaCreateRequest, 
  FacturaUpdateRequest,
  DetalleFacturaCreateRequest 
} from '../types/Factura';
import { Persona } from '../types/Persona';
import { Usuario } from '../types/Usuario';
import { Producto } from '../types/Producto';
import { facturaService, personaService, usuarioService, productoService } from '../services/api';

const FacturaForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const [factura, setFactura] = useState<Factura>({
    fechaFactura: new Date().toISOString().split('T')[0],
    cliente: {} as Persona,
    vendedor: {} as Usuario,
    subtotal: 0,
    impuesto: 0,
    descuento: 0,
    total: 0,
    tipo: TipoFactura.VENTA,
    estado: EstadoFactura.PENDIENTE,
    observaciones: '',
    detalles: []
  });

  const [clientes, setClientes] = useState<Persona[]>([]);
  const [vendedores, setVendedores] = useState<Usuario[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [detalles, setDetalles] = useState<DetalleFactura[]>([]);
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);
  const [productQuantity, setProductQuantity] = useState(1);

  useEffect(() => {
    cargarDatosIniciales();
    if (isEditing && id) {
      cargarFactura(parseInt(id));
    }
  }, [id, isEditing]);

  const cargarDatosIniciales = async () => {
    try {
      const [clientesData, vendedoresData, productosData] = await Promise.all([
        personaService.obtenerTodas(),
        usuarioService.obtenerTodos(),
        productoService.obtenerTodos()
      ]);
      
      setClientes(clientesData);
      setVendedores(vendedoresData);
      setProductos(productosData.filter(p => p.estado === 'ACTIVO'));
    } catch (err) {
      setError('Error al cargar los datos iniciales');
      console.error(err);
    }
  };

  const cargarFactura = async (facturaId: number) => {
    try {
      setLoading(true);
      const data = await facturaService.obtenerPorId(facturaId);
      setFactura(data);
      setDetalles(data.detalles || []);
      // Recalcular totales después de cargar la factura
      setTimeout(() => calcularTotales(), 100);
    } catch (err) {
      setError('Error al cargar la factura');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'clienteId') {
      const cliente = clientes.find(c => c.id === parseInt(value));
      setFactura(prev => ({
        ...prev,
        cliente: cliente || {} as Persona
      }));
    } else if (name === 'vendedorId') {
      const vendedor = vendedores.find(v => v.id === parseInt(value));
      setFactura(prev => ({
        ...prev,
        vendedor: vendedor || {} as Usuario
      }));
    } else {
      setFactura(prev => ({
        ...prev,
        [name]: name.includes('Fecha') ? value : 
                ['subtotal', 'impuesto', 'descuento', 'total'].includes(name) ? 
                parseFloat(value) || 0 : value
      }));
    }

    // Limpiar errores
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAddProduct = () => {
    if (!selectedProduct) return;

    const existingDetail = detalles.find(d => d.producto.id === selectedProduct.id);
    
    if (existingDetail) {
      // Actualizar cantidad si ya existe
      const newDetalles = detalles.map(d => 
        d.producto.id === selectedProduct.id 
          ? { 
              ...d, 
              cantidad: d.cantidad + productQuantity,
              subtotal: (d.cantidad + productQuantity) * d.precioUnitario
            }
          : d
      );
      setDetalles(newDetalles);
    } else {
      // Agregar nuevo detalle
      const nuevoDetalle: DetalleFactura = {
        producto: selectedProduct,
        cantidad: productQuantity,
        precioUnitario: selectedProduct.precio,
        descuento: 0,
        subtotal: selectedProduct.precio * productQuantity
      };
      const nuevosDetalles = [...detalles, nuevoDetalle];
      setDetalles(nuevosDetalles);
      
      // Calcular totales con los nuevos detalles
      setTimeout(() => {
        calcularTotalesConDetalles(nuevosDetalles);
      }, 50);
    }

    setShowProductModal(false);
    setSelectedProduct(null);
    setProductQuantity(1);
  };

  const handleRemoveProduct = (productId: number) => {
    const nuevosDetalles = detalles.filter(d => d.producto.id !== productId);
    setDetalles(nuevosDetalles);
    
    // Calcular totales con los detalles actualizados
    setTimeout(() => {
      calcularTotalesConDetalles(nuevosDetalles);
    }, 50);
  };

  const handleUpdateDetailQuantity = (productId: number, cantidad: number) => {
    const newDetalles = detalles.map(d => 
      d.producto.id === productId 
        ? { ...d, cantidad, subtotal: cantidad * d.precioUnitario }
        : d
    );
    setDetalles(newDetalles);
    
    // Calcular totales con los detalles actualizados
    setTimeout(() => {
      calcularTotalesConDetalles(newDetalles);
    }, 50);
  };

  // Función auxiliar para calcular totales con detalles específicos
  const calcularTotalesConDetalles = (detallesParaCalcular: DetalleFactura[]) => {
    // Calcular subtotal sumando todos los detalles
    const subtotal = detallesParaCalcular.reduce((sum, detalle) => sum + detalle.subtotal, 0);
    
    // Total = Subtotal (sin impuestos ni descuentos)
    const total = subtotal;

    setFactura(prev => ({
      ...prev,
      subtotal: Math.round(subtotal * 100) / 100, // Redondear a 2 decimales
      impuesto: 0,
      descuento: 0,
      total: Math.round(Math.max(0, total) * 100) / 100
    }));
  };

  const calcularTotales = () => {
    calcularTotalesConDetalles(detalles);
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Número de factura se genera automáticamente en el backend

    if (!factura.fechaFactura) {
      newErrors.fechaFactura = 'La fecha de factura es obligatoria';
    }

    if (!factura.cliente?.id) {
      newErrors.clienteId = 'El cliente es obligatorio';
    }

    if (!factura.vendedor?.id) {
      newErrors.vendedorId = 'El vendedor es obligatorio';
    }

    if (detalles.length === 0) {
      newErrors.detalles = 'Debe agregar al menos un producto';
    }

    if (factura.total <= 0) {
      newErrors.total = 'El total debe ser mayor a 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError('');

      const facturaData = {
        // numeroFactura se genera automáticamente en el backend
        fechaFactura: new Date(factura.fechaFactura).toISOString(),
        clienteId: parseInt(factura.cliente?.id?.toString() || '0'),
        vendedorId: parseInt(factura.vendedor?.id?.toString() || '0'),
        subtotal: parseFloat(factura.subtotal.toString()),
        impuesto: parseFloat((factura.impuesto || 0).toString()),
        descuento: parseFloat((factura.descuento || 0).toString()),
        total: parseFloat(factura.total.toString()),
        tipo: factura.tipo,
        estado: factura.estado,
        observaciones: factura.observaciones || '',
        detalles: detalles.map(d => ({
          productoId: parseInt(d.producto.id?.toString() || '0'),
          cantidad: parseInt(d.cantidad.toString()),
          precioUnitario: parseFloat(d.precioUnitario.toString()),
          descuento: parseFloat((d.descuento || 0).toString()),
          subtotal: parseFloat(d.subtotal.toString())
        }))
      };

      console.log('Datos enviados al backend:', JSON.stringify(facturaData, null, 2));

      if (isEditing) {
        await facturaService.actualizar(parseInt(id!), facturaData);
        setMessage('Factura actualizada exitosamente');
      } else {
        await facturaService.crear(facturaData);
        setMessage('Factura creada exitosamente');
      }

      setTimeout(() => {
        navigate('/facturas');
      }, 1500);

    } catch (err: any) {
      console.error('Error completo:', err);
      console.error('Response data:', err.response?.data);
      console.error('Response status:', err.response?.status);
      console.error('Response headers:', err.response?.headers);
      
      let errorMessage = 'Error al guardar la factura';
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } else if (err.response.data.mensaje) {
          errorMessage = err.response.data.mensaje;
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.data.errors) {
          errorMessage = err.response.data.errors.map((e: any) => e.defaultMessage || e.message).join(', ');
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
  };

  if (loading && isEditing) {
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
          <h2>
            {isEditing 
              ? `Editar ${factura.tipo === TipoFactura.VENTA ? 'Venta' : 'Compra'}` 
              : `Nueva ${factura.tipo === TipoFactura.VENTA ? 'Venta' : 'Compra'}`}
          </h2>
          <p className="text-muted">
            {isEditing ? 'Modifica los datos de la factura' : 'Crea una nueva factura en el sistema'}
          </p>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {message && (
        <Alert variant="success" dismissible onClose={() => setMessage('')}>
          {message}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Row>
          {/* Información básica */}
          <Col md={8}>
            <Card className="mb-4">
              <Card.Header>
                <h5>Información de la Factura</h5>
                <small className="text-muted">
                  <i className="fas fa-info-circle me-1"></i>
                  El número de factura se genera automáticamente
                </small>
              </Card.Header>
              <Card.Body>
                <Row>
                  {/* Número de factura se genera automáticamente */}
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Fecha de Factura *</Form.Label>
                      <Form.Control
                        type="date"
                        name="fechaFactura"
                        value={factura.fechaFactura}
                        onChange={handleInputChange}
                        isInvalid={!!errors.fechaFactura}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.fechaFactura}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Tipo de Operación *</Form.Label>
                      <Form.Select
                        name="tipo"
                        value={factura.tipo}
                        onChange={handleInputChange}
                        isInvalid={!!errors.tipo}
                        disabled={isEditing}
                      >
                        <option value={TipoFactura.VENTA}>Venta</option>
                        <option value={TipoFactura.COMPRA}>Compra</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.tipo}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>{factura.tipo === TipoFactura.VENTA ? 'Cliente *' : 'Proveedor *'}</Form.Label>
                      <Form.Select
                        name="clienteId"
                        value={factura.cliente?.id || ''}
                        onChange={handleInputChange}
                        isInvalid={!!errors.clienteId}
                      >
                        <option value="">Seleccionar {factura.tipo === TipoFactura.VENTA ? 'cliente' : 'proveedor'}...</option>
                        {clientes.map((cliente) => (
                          <option key={cliente.id} value={cliente.id}>
                            {cliente.nombre} {cliente.apellido} - {cliente.cedula}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.clienteId}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>{factura.tipo === TipoFactura.VENTA ? 'Vendedor *' : 'Responsable *'}</Form.Label>
                      <Form.Select
                        name="vendedorId"
                        value={factura.vendedor?.id || ''}
                        onChange={handleInputChange}
                        isInvalid={!!errors.vendedorId}
                      >
                        <option value="">Seleccionar {factura.tipo === TipoFactura.VENTA ? 'vendedor' : 'responsable'}...</option>
                        {vendedores.map((vendedor) => (
                          <option key={vendedor.id} value={vendedor.id}>
                            {vendedor.usuario}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.vendedorId}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Observaciones</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="observaciones"
                    value={factura.observaciones || ''}
                    onChange={handleInputChange}
                    placeholder="Observaciones adicionales..."
                  />
                </Form.Group>
              </Card.Body>
            </Card>

            {/* Productos */}
            <Card className="mb-4">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5>Productos</h5>
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => setShowProductModal(true)}
                >
                  Agregar Producto
                </Button>
              </Card.Header>
              <Card.Body>
                {detalles.length === 0 ? (
                  <Alert variant="info">
                    No hay productos agregados. Haz clic en "Agregar Producto" para comenzar.
                  </Alert>
                ) : (
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Precio Unit.</th>
                        <th>Subtotal</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detalles.map((detalle, index) => (
                        <tr key={index}>
                          <td>
                            <div>
                              <strong>{detalle.producto.nombre}</strong>
                              <br />
                              <small className="text-muted">{detalle.producto.codigo}</small>
                            </div>
                          </td>
                          <td>
                            <InputGroup size="sm">
                              <Form.Control
                                type="number"
                                min="1"
                                value={detalle.cantidad}
                                onChange={(e) => handleUpdateDetailQuantity(
                                  detalle.producto.id!, 
                                  parseInt(e.target.value) || 1
                                )}
                              />
                            </InputGroup>
                          </td>
                          <td>{formatCurrency(detalle.precioUnitario)}</td>
                          <td>{formatCurrency(detalle.subtotal)}</td>
                          <td>
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              onClick={() => handleRemoveProduct(detalle.producto.id!)}
                            >
                              Eliminar
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
                {errors.detalles && (
                  <Alert variant="danger" className="mt-2">
                    {errors.detalles}
                  </Alert>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* Totales */}
          <Col md={4}>
            <Card className="mb-4">
              <Card.Header>
                <h5>Totales</h5>
                <small className="text-muted">
                  <i className="fas fa-calculator me-1"></i>
                  El subtotal y total se calculan automáticamente
                </small>
              </Card.Header>
              <Card.Body>
                <Row className="mb-2">
                  <Col>
                    <strong>Subtotal:</strong>
                  </Col>
                  <Col className="text-end">
                    {formatCurrency(factura.subtotal)}
                  </Col>
                </Row>

                {/* Impuesto y descuento removidos - solo subtotal y total */}

                <hr />

                <Row>
                  <Col>
                    <h5>Total:</h5>
                  </Col>
                  <Col className="text-end">
                    <h5 className="text-primary">
                      {formatCurrency(factura.total)}
                    </h5>
                  </Col>
                </Row>

                {errors.total && (
                  <Alert variant="danger" className="mt-2">
                    {errors.total}
                  </Alert>
                )}

                <div className="d-grid gap-2 mt-3">
                  <Button type="submit" variant="primary" disabled={loading}>
                    {loading ? <Spinner size="sm" /> : (isEditing ? 'Actualizar' : 'Crear')} Factura
                  </Button>
                  <Button variant="secondary" onClick={() => navigate('/facturas')}>
                    Cancelar
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Form>

      {/* Modal de selección de productos */}
      <Modal show={showProductModal} onHide={() => setShowProductModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Seleccionar Producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Código</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Cantidad</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto) => (
                <tr key={producto.id}>
                  <td>
                    <div>
                      <strong>{producto.nombre}</strong>
                      <br />
                      <small className="text-muted">{producto.descripcion}</small>
                    </div>
                  </td>
                  <td>{producto.codigo}</td>
                  <td>{formatCurrency(producto.precio)}</td>
                  <td>
                    <Badge bg={producto.stock > 0 ? 'success' : 'danger'}>
                      {producto.stock}
                    </Badge>
                  </td>
                  <td>
                    {selectedProduct?.id === producto.id ? (
                      <InputGroup size="sm">
                        <Form.Control
                          type="number"
                          min="1"
                          max={producto.stock}
                          value={productQuantity}
                          onChange={(e) => setProductQuantity(parseInt(e.target.value) || 1)}
                        />
                      </InputGroup>
                    ) : (
                      <span>-</span>
                    )}
                  </td>
                  <td>
                    {selectedProduct?.id === producto.id ? (
                      <Button 
                        variant="success" 
                        size="sm"
                        onClick={handleAddProduct}
                        disabled={productQuantity <= 0 || productQuantity > producto.stock}
                      >
                        Agregar
                      </Button>
                    ) : (
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => {
                          setSelectedProduct(producto);
                          setProductQuantity(1);
                        }}
                        disabled={producto.stock <= 0}
                      >
                        Seleccionar
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowProductModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default FacturaForm;
