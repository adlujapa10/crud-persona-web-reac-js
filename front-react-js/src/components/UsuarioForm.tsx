import React, { useState, useEffect } from 'react';
import { 
  Form, 
  Button, 
  Card, 
  Alert, 
  Row, 
  Col, 
  Spinner,
  Badge
} from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { Usuario, UsuarioCreateRequest, UsuarioUpdateRequest } from '../types/Usuario';
import { usuarioService } from '../services/api';
import { Persona } from '../types/Persona';

const UsuarioForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState<UsuarioCreateRequest>({
    usuario: '',
    contrasena: '',
    personaId: 0
  });
  const [personasDisponibles, setPersonasDisponibles] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [usuarioExists, setUsuarioExists] = useState(false);

  // Cargar personas disponibles al inicializar
  useEffect(() => {
    const cargarPersonasDisponibles = async () => {
      try {
        const personas = await usuarioService.obtenerPersonasDisponibles();
        setPersonasDisponibles(personas);
      } catch (err) {
        console.error('Error al cargar personas disponibles:', err);
        setError('Error al cargar personas disponibles');
      }
    };

    cargarPersonasDisponibles();
  }, []);

  useEffect(() => {
    if (isEditing) {
      cargarUsuario();
    }
  }, [id]);

  const cargarUsuario = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError('');
      
      const usuario = await usuarioService.obtenerPorId(parseInt(id));
      
      // Convertir el usuario a formato de formulario
      setFormData({
        usuario: usuario.usuario,
        contrasena: '', // No cargamos la contraseña por seguridad
        personaId: usuario.persona?.id || 0
      });
    } catch (err) {
      setError('Error al cargar el usuario');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: UsuarioCreateRequest) => ({
      ...prev,
      [name]: name === 'personaId' ? parseInt(value) || 0 : value
    }));

    // Limpiar errores cuando el usuario empiece a escribir
    if (error) {
      setError('');
    }
    if (success) {
      setSuccess('');
    }

    // Verificar si el nombre de usuario ya existe
    if (name === 'usuario' && value.trim()) {
      verificarUsuario(value);
    }
  };

  // Verificar si el nombre de usuario ya existe
  const verificarUsuario = async (usuario: string) => {
    try {
      // Por ahora, no verificamos duplicados en tiempo real
      // La validación se hace en el backend
      setUsuarioExists(false);
    } catch (err) {
      console.error('Error al verificar usuario:', err);
      setUsuarioExists(false);
    }
  };

  const validateForm = (): boolean => {
    if (!formData.usuario.trim()) {
      setError('El nombre de usuario es obligatorio');
      return false;
    }

    if (!isEditing && !formData.contrasena.trim()) {
      setError('La contraseña es obligatoria');
      return false;
    }

    if (formData.contrasena.trim() && formData.contrasena.length < 4) {
      setError('La contraseña debe tener al menos 4 caracteres');
      return false;
    }

    if (!formData.personaId) {
      setError('La persona asociada al usuario es obligatoria');
      return false;
    }

    if (usuarioExists && !isEditing) {
      setError('El nombre de usuario ya existe');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      setError('');
      setSuccess('');

      if (isEditing) {
        const updateData: UsuarioUpdateRequest = {
          usuario: formData.usuario,
          personaId: formData.personaId
        };

        // Solo incluir contraseña si se proporcionó una nueva
        if (formData.contrasena.trim()) {
          updateData.contrasena = formData.contrasena;
        }

        await usuarioService.actualizar(parseInt(id!), updateData);
        setSuccess('Usuario actualizado exitosamente');
      } else {
        await usuarioService.crear(formData);
        setSuccess('Usuario creado exitosamente');
      }

      // Redirigir después de un breve delay
      setTimeout(() => {
        navigate('/usuarios');
      }, 1500);
    } catch (err: any) {
      console.error('Error al guardar usuario:', err);
      setError(err.response?.data?.mensaje || 'Error al guardar el usuario');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/usuarios');
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
          <p className="mt-2">Cargando usuario...</p>
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
            <i className="fas fa-user-plus text-primary me-2"></i>
            {isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}
          </h2>
          <p className="text-muted">
            {isEditing ? 'Modifica la información del usuario' : 'Crea un nuevo usuario del sistema'}
          </p>
        </div>
        <Button variant="outline-secondary" onClick={handleCancel}>
          <i className="fas fa-arrow-left me-2"></i>
          Volver
        </Button>
      </div>

      {/* Mensajes */}
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess('')}>
          <i className="fas fa-check-circle me-2"></i>
          {success}
        </Alert>
      )}

      {/* Formulario */}
      <Card>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              {/* Información de Usuario */}
              <Col md={6}>
                <h5 className="mb-3">
                  <i className="fas fa-user-circle text-primary me-2"></i>
                  Información de Usuario
                </h5>
                
                <Form.Group className="mb-3">
                  <Form.Label>
                    <i className="fas fa-user me-2"></i>
                    Nombre de Usuario *
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="usuario"
                    value={formData.usuario}
                    onChange={handleInputChange}
                    placeholder="Ingresa el nombre de usuario"
                    isInvalid={usuarioExists && !isEditing}
                    required
                  />
                  {usuarioExists && !isEditing && (
                    <Form.Control.Feedback type="invalid">
                      <i className="fas fa-exclamation-triangle me-1"></i>
                      Este nombre de usuario ya existe
                    </Form.Control.Feedback>
                  )}
                  <Form.Text className="text-muted">
                    Debe ser único en el sistema
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    <i className="fas fa-lock me-2"></i>
                    Contraseña {!isEditing && '*'}
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="contrasena"
                    value={formData.contrasena}
                    onChange={handleInputChange}
                    placeholder={isEditing ? "Deja vacío para mantener la actual" : "Ingresa la contraseña"}
                    required={!isEditing}
                  />
                  <Form.Text className="text-muted">
                    {isEditing 
                      ? "Deja vacío para mantener la contraseña actual"
                      : "Mínimo 4 caracteres"
                    }
                  </Form.Text>
                </Form.Group>
              </Col>

              {/* Información Personal */}
              <Col md={6}>
                <h5 className="mb-3">
                  <i className="fas fa-id-card text-success me-2"></i>
                  Información Personal
                </h5>
                
                <Form.Group className="mb-3">
                  <Form.Label>
                    <i className="fas fa-user me-2"></i>
                    Persona *
                  </Form.Label>
                  <Form.Select
                    name="personaId"
                    value={formData.personaId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Selecciona una persona</option>
                    {personasDisponibles.map(persona => (
                      <option key={persona.id} value={persona.id}>
                        {persona.nombre} {persona.apellido} - {persona.cedula}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            {/* Información adicional */}
            <Row className="mt-3">
              <Col md={12}>
                <Card className="bg-light">
                  <Card.Body>
                    <h6>
                      <i className="fas fa-info-circle text-info me-2"></i>
                      Información Adicional
                    </h6>
                    <div className="row">
                      <div className="col-md={6}">
                        <p className="mb-1">
                          <strong>Estado:</strong> 
                          <Badge bg="success" className="ms-2">Activo</Badge>
                        </p>
                        <p className="mb-1">
                          <strong>Rol:</strong> 
                          <Badge bg="info" className="ms-2">Usuario</Badge>
                        </p>
                      </div>
                      <div className="col-md={6}">
                        <p className="mb-1">
                          <strong>Fecha de Creación:</strong> 
                          <span className="text-muted ms-2">
                            {isEditing ? 'Modificado' : 'Al crear'}
                          </span>
                        </p>
                        <p className="mb-0">
                          <strong>Último Acceso:</strong> 
                          <span className="text-muted ms-2">
                            {isEditing ? 'Al iniciar sesión' : 'N/A'}
                          </span>
                        </p>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Botones de acción */}
            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button variant="outline-secondary" onClick={handleCancel}>
                <i className="fas fa-times me-2"></i>
                Cancelar
              </Button>
              <Button 
                type="submit" 
                variant="primary"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save me-2"></i>
                    {isEditing ? 'Actualizar' : 'Crear'} Usuario
                  </>
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default UsuarioForm;
