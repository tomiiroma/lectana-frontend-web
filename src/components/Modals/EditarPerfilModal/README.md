# Modal de Edición de Perfil de Administrador

## 📋 Funcionalidades Implementadas

### ✅ Sistema Completo de Edición de Perfil

**Componente Principal:** `EditarPerfilModal.jsx`

### 🎯 Características Principales

1. **Dos Pestañas de Edición:**
   - **Datos Personales:** Editar nombre, apellido, email, edad y DNI
   - **Cambio de Contraseña:** Cambiar contraseña con validaciones de seguridad

2. **Integración con API:**
   - `obtenerPerfilAdministrador()` - Obtiene datos del perfil
   - `actualizarPerfilAdministrador()` - Actualiza datos personales
   - `cambiarContrasenaAdministrador()` - Cambia contraseña

3. **Validaciones Implementadas:**
   - Campos requeridos (nombre, apellido, email, edad, DNI)
   - Validación de email
   - Edad entre 18-120 años
   - DNI mínimo 6 caracteres
   - Contraseña nueva mínimo 8 caracteres
   - Confirmación de contraseña

4. **Estados de Carga:**
   - Loading spinner durante operaciones
   - Mensajes de éxito y error
   - Deshabilitación de formularios durante carga

5. **UX/UI:**
   - Diseño responsive
   - Animaciones suaves
   - Iconos descriptivos
   - Colores consistentes con el tema

### 🔗 Estructura de Datos Esperada

```javascript
// Respuesta de obtenerPerfilAdministrador()
{
  "id_administrador": 1,
  "dni": "12345678",
  "usuario_id_usuario": 5,
  "usuario": {
    "id_usuario": 5,
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "juan@email.com",
    "edad": 35,
    "activo": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

### 🎨 Estilos

- **Archivo CSS:** `EditarPerfilModal.css`
- **Tema:** Consistente con el diseño del sistema
- **Colores:** Gradientes púrpura (#8b5cf6, #7c3aed)
- **Responsive:** Adaptable a móviles y tablets

### 🚀 Uso

```jsx
import EditarPerfilModal from './components/Modals/EditarPerfilModal/EditarPerfilModal';

// En tu componente
const [showEditModal, setShowEditModal] = useState(false);

<EditarPerfilModal 
  isOpen={showEditModal}
  onClose={() => setShowEditModal(false)}
/>
```

### ⚡ Endpoints del Backend Requeridos

1. **GET** `/api/administrador/obtener-perfil-administrador`
2. **PUT** `/api/administrador/actualizar-perfil-administrador`
3. **PUT** `/api/administrador/cambiar-contrasena-administrador`

### 🔒 Seguridad

- Autenticación JWT requerida
- Validación de contraseña actual para cambios
- Solo campos modificados se envían al backend
- Manejo seguro de errores

### 📱 Responsive Design

- Modal adaptable a diferentes pantallas
- Formularios optimizados para móviles
- Tabs colapsables en pantallas pequeñas
- Botones de tamaño táctil apropiado

¡Sistema completo y listo para usar! 🎉
