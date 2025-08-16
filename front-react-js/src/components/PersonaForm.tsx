import React, { useState, useEffect, ChangeEvent } from 'react';
import { Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { Persona, Sexo } from '../types/Persona';
import { personaService } from '../services/api';

const PersonaForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const [persona, setPersona] = useState<Persona>({
    nombre: '',
    apellido: '',
    cedula: '',
    telefono: '',
    email: '',
    edad: undefined,
    sexo: undefined,
    rol: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditing && id) {
      cargarPersona(parseInt(id));
    }
  }, [id, isEditing]);

  const cargarPersona = async (personaId: number) => {
    try {
      setLoading(true);
      const data = await personaService.obtenerPorId(personaId);
      setPersona(data);
    } catch (err) {
      setError('Error al cargar la persona');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPersona(prev => ({
      ...prev,
      [name]: value === '' ? undefined : value
    }));
    
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!persona.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }

    if (!persona.apellido.trim()) {
      newErrors.apellido = 'El apellido es obligatorio';
    }

    if (!persona.cedula.trim()) {
      newErrors.cedula = 'La cédula es obligatoria';
    }

    if (persona.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(persona.email)) {
      newErrors.email = 'Formato de email inválido';
    }

    if (persona.edad && (persona.edad < 1 || persona.edad > 120)) {
      newErrors.edad = 'La edad debe estar entre 1 y 120 años';
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
        await personaService.actualizar(parseInt(id), persona);
        setMessage('Persona actualizada exitosamente');
      } else {
        await personaService.crear(persona);
        setMessage('Persona creada exitosamente');
      }

      setTimeout(() => {
        navigate('/personas');
      }, 1500);

    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al guardar la persona');
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
        <div className="col-md-8">
          <Card>
            <Card.Header>
              <h4>
                <i className="fas fa-user me-2"></i>
                {isEditing ? 'Editar Persona' : 'Nueva Persona'}
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
                      <Form.Label>Nombre *</Form.Label>
                      <Form.Control
                        type="text"
                        name="nombre"
                        value={persona.nombre}
                        onChange={handleInputChange}
                        isInvalid={!!errors.nombre}
                        placeholder="Ingrese el nombre"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.nombre}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Apellido *</Form.Label>
                      <Form.Control
                        type="text"
                        name="apellido"
                        value={persona.apellido}
                        onChange={handleInputChange}
                        isInvalid={!!errors.apellido}
                        placeholder="Ingrese el apellido"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.apellido}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Cédula *</Form.Label>
                      <Form.Control
                        type="text"
                        name="cedula"
                        value={persona.cedula}
                        onChange={handleInputChange}
                        isInvalid={!!errors.cedula}
                        placeholder="Ingrese la cédula"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.cedula}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Teléfono</Form.Label>
                      <Form.Control
                        type="tel"
                        name="telefono"
                        value={persona.telefono || ''}
                        onChange={handleInputChange}
                        placeholder="Ingrese el teléfono"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={persona.email || ''}
                        onChange={handleInputChange}
                        isInvalid={!!errors.email}
                        placeholder="Ingrese el email"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Edad</Form.Label>
                      <Form.Control
                        type="number"
                        name="edad"
                        value={persona.edad || ''}
                        onChange={handleInputChange}
                        isInvalid={!!errors.edad}
                        placeholder="Ingrese la edad"
                        min="1"
                        max="120"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.edad}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Sexo</Form.Label>
                      <Form.Select
                        name="sexo"
                        value={persona.sexo || ''}
                        onChange={handleInputChange}
                      >
                        <option value="">Seleccione...</option>
                        <option value={Sexo.M}>Masculino</option>
                        <option value={Sexo.F}>Femenino</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Rol</Form.Label>
                      <Form.Control
                        type="text"
                        name="rol"
                        value={persona.rol || ''}
                        onChange={handleInputChange}
                        placeholder="Ingrese el rol"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-flex justify-content-between">
                  <Button
                    variant="secondary"
                    onClick={() => navigate('/personas')}
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

export default PersonaForm;
