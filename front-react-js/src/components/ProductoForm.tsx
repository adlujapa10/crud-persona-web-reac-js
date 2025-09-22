import React, { useState, useEffect, ChangeEvent } from 'react';
import { Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { Producto, Estado } from '../types/Producto';
import { productoService } from '../services/api';

const ProductoForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const [producto, setProducto] = useState<Producto>({
    nombre: '',
    descripcion: '',
    codigo: '',
    precio: 0,
    stock: 0,
    stockMinimo: 0,
    categoria: '',
    marca: '',
    estado: Estado.ACTIVO
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditing && id) {
      cargarProducto(parseInt(id));
    }
  }, [id, isEditing]);

  const cargarProducto = async (productoId: number) => {
    try {
      setLoading(true);
      const data = await productoService.obtenerPorId(productoId);
      setProducto(data);
    } catch (err) {
      setError('Error al cargar el producto');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProducto(prev => ({
      ...prev,
      [name]: value === '' ? (name === 'precio' || name === 'stock' || name === 'stockMinimo' ? 0 : '') : 
             (name === 'precio' || name === 'stock' || name === 'stockMinimo' ? parseFloat(value) || 0 : value)
    }));
    
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!producto.nombre.trim()) {
      newErrors.nombre = 'El nombre del producto es obligatorio';
    }

    if (!producto.codigo.trim()) {
      newErrors.codigo = 'El código del producto es obligatorio';
    }

    if (producto.precio <= 0) {
      newErrors.precio = 'El precio debe ser mayor a 0';
    }

    if (producto.stock < 0) {
      newErrors.stock = 'El stock no puede ser negativo';
    }

    if (producto.stockMinimo && producto.stockMinimo < 0) {
      newErrors.stockMinimo = 'El stock mínimo no puede ser negativo';
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
      setMessage('');

      if (isEditing && id) {
        await productoService.actualizar(parseInt(id), producto);
        setMessage('Producto actualizado exitosamente');
      } else {
        await productoService.crear(producto);
        setMessage('Producto creado exitosamente');
      }

      setTimeout(() => {
        navigate('/productos');
      }, 1500);

    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al guardar el producto');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return <div className="text-center mt-4">Cargando...</div>;
  }

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <Card>
            <Card.Header>
              <h4>
                <i className="fas fa-box me-2"></i>
                {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
              </h4>
            </Card.Header>
            <Card.Body>
              {message && (
                <Alert variant="success" dismissible onClose={() => setMessage('')}>
                  <i className="fas fa-check-circle me-2"></i>
                  {message}
                </Alert>
              )}

              {error && (
                <Alert variant="danger" dismissible onClose={() => setError('')}>
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nombre del Producto *</Form.Label>
                      <Form.Control
                        type="text"
                        name="nombre"
                        value={producto.nombre}
                        onChange={handleInputChange}
                        isInvalid={!!errors.nombre}
                        placeholder="Ingrese el nombre del producto"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.nombre}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Código del Producto *</Form.Label>
                      <Form.Control
                        type="text"
                        name="codigo"
                        value={producto.codigo}
                        onChange={handleInputChange}
                        isInvalid={!!errors.codigo}
                        placeholder="Ingrese el código único"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.codigo}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Descripción</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="descripcion"
                        value={producto.descripcion || ''}
                        onChange={handleInputChange}
                        placeholder="Ingrese una descripción del producto"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Precio *</Form.Label>
                      <Form.Control
                        type="number"
                        step="0.01"
                        min="0.01"
                        name="precio"
                        value={producto.precio}
                        onChange={handleInputChange}
                        isInvalid={!!errors.precio}
                        placeholder="0.00"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.precio}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Stock *</Form.Label>
                      <Form.Control
                        type="number"
                        min="0"
                        name="stock"
                        value={producto.stock}
                        onChange={handleInputChange}
                        isInvalid={!!errors.stock}
                        placeholder="0"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.stock}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Stock Mínimo</Form.Label>
                      <Form.Control
                        type="number"
                        min="0"
                        name="stockMinimo"
                        value={producto.stockMinimo || ''}
                        onChange={handleInputChange}
                        isInvalid={!!errors.stockMinimo}
                        placeholder="0"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.stockMinimo}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Categoría</Form.Label>
                      <Form.Control
                        type="text"
                        name="categoria"
                        value={producto.categoria || ''}
                        onChange={handleInputChange}
                        placeholder="Ej: Electrónicos, Ropa, etc."
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Marca</Form.Label>
                      <Form.Control
                        type="text"
                        name="marca"
                        value={producto.marca || ''}
                        onChange={handleInputChange}
                        placeholder="Ej: Samsung, Nike, etc."
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Estado</Form.Label>
                      <Form.Select
                        name="estado"
                        value={producto.estado}
                        onChange={handleInputChange}
                      >
                        <option value={Estado.ACTIVO}>Activo</option>
                        <option value={Estado.INACTIVO}>Inactivo</option>
                        <option value={Estado.AGOTADO}>Agotado</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-flex justify-content-between">
                  <Button
                    variant="secondary"
                    onClick={() => navigate('/productos')}
                    disabled={loading}
                  >
                    <i className="fas fa-arrow-left me-2"></i>
                    Cancelar
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <i className="fas fa-spinner fa-spin me-2"></i>
                        Guardando...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save me-2"></i>
                        {isEditing ? 'Actualizar' : 'Guardar'}
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductoForm;
