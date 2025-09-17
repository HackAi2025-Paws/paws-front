# Arquitectura del Proyecto - PawsCare

## 📁 Estructura Modular

### `/src/services/`
**Capa de servicios** - Abstrae las llamadas a APIs y manejo de datos
- `patientService.ts` - Servicio principal para operaciones de pacientes
  - Interface `PatientService` define el contrato
  - `MockPatientService` - Implementación con datos simulados
  - `ApiPatientService` - Implementación para API real
  - Factory pattern para cambiar entre mock/real

### `/src/hooks/`
**Hooks personalizados** - Lógica de negocio reutilizable
- `usePatientDetail.ts` - Maneja datos del paciente y registros
- `usePatientExport.ts` - Lógica de exportación PDF
- `usePatientData.ts` - Datos específicos del paciente

### `/src/components/`
**Componentes modulares** - UI reutilizable
- `patient/` - Componentes específicos de pacientes
  - `PatientSidebar.tsx` - Información lateral del paciente
  - `PatientTabs.tsx` - Sistema de navegación por pestañas
  - `PatientRecordsList.tsx` - Lista de registros médicos
  - `PatientRecordDetailModal.tsx` - Modal con detalles de consulta
  - `PatientExportModal.tsx` - Modal de exportación PDF

### `/src/config/`
**Configuración** - Settings centralizados
- `app.ts` - Configuración general de la aplicación
  - `USE_MOCK_DATA` - Switch entre mock/real data
  - Feature flags
  - URLs de API

## 🔄 Flujo de Datos

```
Page Component (PetDetailPage)
    ↓
Custom Hooks (usePatientDetail, usePatientExport)
    ↓
Service Layer (PatientService)
    ↓
Mock Data / Real API
```

## 🚀 Integración con Datos Reales

### 1. Cambiar Configuración
```typescript
// src/config/app.ts
export const APP_CONFIG = {
  USE_MOCK_DATA: false, // Cambiar a false
  API_BASE_URL: 'https://api.pawscare.com'
}
```

### 2. Los Servicios se Adaptan Automáticamente
- `ApiPatientService` se activará automáticamente
- Todos los endpoints están documentados
- Error handling incluido

### 3. Componentes No Cambian
- Toda la UI funciona igual
- Los hooks manejan la abstracción
- Zero cambios en componentes React

## 📋 Beneficios de esta Arquitectura

### ✅ **Separación de Responsabilidades**
- UI components: Solo presentación
- Hooks: Lógica de estado y negocio
- Services: Manejo de datos
- Types: Contratos de datos

### ✅ **Fácil Testing**
- Services son testeable independientemente
- Hooks se pueden testear con servicios mock
- Componentes se testean con props simples

### ✅ **Escalabilidad**
- Agregar nuevos endpoints es simple
- Reutilización de lógica entre páginas
- Componentes altamente reutilizables

### ✅ **Mantenibilidad**
- Cambios en API no afectan UI
- Mock data centralizado
- Configuración en un solo lugar

## 🔧 Patrones Utilizados

### Service Layer Pattern
Abstrae el acceso a datos del resto de la aplicación.

### Custom Hooks Pattern
Encapsula lógica de estado y efectos reutilizable.

### Factory Pattern
Para crear la instancia correcta del service (mock vs real).

### Singleton Pattern
Una sola instancia del service por sesión.

### Interface Segregation
Interfaces pequeñas y específicas por responsabilidad.

## 📝 Ejemplo de Uso

```typescript
// En cualquier componente
function MyComponent() {
  const { patient, loading } = usePatientDetail('patient-id')
  const { handleExport } = usePatientExport()

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h1>{patient?.name}</h1>
      <button onClick={() => handleExport('patient-id')}>
        Export PDF
      </button>
    </div>
  )
}
```

## 🎯 Próximos Pasos

1. **Implementar API real** - Cambiar `USE_MOCK_DATA` a `false`
2. **Agregar tests unitarios** - Para services y hooks
3. **Error boundaries** - Manejo robusto de errores
4. **State management global** - Si la app crece (Redux/Zustand)
5. **Caching** - React Query o SWR para optimizar requests