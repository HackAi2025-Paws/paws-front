# Guía de Integración con Datos Reales

## Resumen

El PetDetailPage ha sido completamente abstraído en componentes reutilizables y preparado para la fácil integración con datos reales. Esta guía explica cómo reemplazar los mocks con APIs reales.

## Arquitectura Actual

### Componentes Abstraídos

1. **PatientSidebar** - Información básica y acciones del paciente
2. **PatientTabs** - Sistema de navegación por pestañas
3. **PatientRecordsList** - Lista de registros médicos con búsqueda
4. **PatientRecordDetailModal** - Modal con detalles completos de consulta
5. **PatientExportModal** - Modal para exportar datos a PDF

### Hooks Personalizados

1. **usePatientData** - Maneja datos detallados del paciente
2. **usePatientExport** - Lógica de exportación de PDF

## Pasos para Integración

### 1. Reemplazar Mock Client

**Actual:**
```typescript
// src/modules/patients/mockClient.ts
export const mockPatientsClient: PatientsClient = {
  async search({ query }: PatientSearchInput): Promise<Patient[]> {
    // Mock implementation
  }
}
```

**Reemplazar con:**
```typescript
// src/modules/patients/apiClient.ts
export const patientsApiClient: PatientsClient = {
  async search({ query }: PatientSearchInput): Promise<Patient[]> {
    const response = await fetch(`/api/patients/search?q=${query}`)
    return response.json()
  },

  async getById(id: string): Promise<Patient | null> {
    const response = await fetch(`/api/patients/${id}`)
    return response.json()
  },

  async listRecords(patientId: string): Promise<PatientRecord[]> {
    const response = await fetch(`/api/patients/${patientId}/records`)
    return response.json()
  }
}
```

### 2. Actualizar Hook de Datos del Paciente

**Actual:**
```typescript
// src/hooks/usePatientData.ts
export function usePatientData(patientId?: string) {
  const patientDetails = useMemo(() => {
    return patientId ? MOCK_PATIENT_DETAILS[patientId] : undefined
  }, [patientId])

  return { patientDetails }
}
```

**Reemplazar con:**
```typescript
export function usePatientData(patientId?: string) {
  const [patientDetails, setPatientDetails] = useState<PatientDetails>()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!patientId) return

    const fetchDetails = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/patients/${patientId}/details`)
        const details = await response.json()
        setPatientDetails(details)
      } finally {
        setLoading(false)
      }
    }

    fetchDetails()
  }, [patientId])

  return { patientDetails, loading }
}
```

### 3. Implementar Exportación Real de PDF

**Actual:**
```typescript
// src/hooks/usePatientExport.ts
const handleExport = () => {
  console.log('Exportando:', selectedOptions)
  alert(\`PDF exportado con: \${selectedOptions.join(', ')}\`)
}
```

**Reemplazar con:**
```typescript
const handleExport = async () => {
  const selectedOptions = Object.entries(exportOptions)
    .filter(([, selected]) => selected)
    .map(([key]) => key)

  try {
    const response = await fetch('/api/patients/export-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patientId,
        options: selectedOptions
      })
    })

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = \`paciente-\${patientId}-\${Date.now()}.pdf\`
    a.click()
  } catch (error) {
    console.error('Error exporting PDF:', error)
    alert('Error al exportar PDF')
  }
}
```

### 4. Actualizar Page para usar API Client

**En PetDetailPage.tsx:**
```typescript
// Cambiar de:
import mockPatientsClient from '../modules/patients/mockClient'
const client = useMemo(() => mockPatientsClient, [])

// A:
import { patientsApiClient } from '../modules/patients/apiClient'
const client = useMemo(() => patientsApiClient, [])
```

## Endpoints API Necesarios

### GET /api/patients/search
- Query param: `q` (string)
- Response: `Patient[]`

### GET /api/patients/:id
- Response: `Patient | null`

### GET /api/patients/:id/details
- Response: `PatientDetails`

### GET /api/patients/:id/records
- Response: `PatientRecord[]`

### POST /api/patients/export-pdf
- Body: `{ patientId: string, options: string[] }`
- Response: PDF blob

## Características Implementadas

✅ **Componentes totalmente abstraídos**
✅ **Tipos TypeScript completos**
✅ **Hooks reutilizables**
✅ **Interfaz lista para datos reales**
✅ **Manejo de estados de carga**
✅ **Sistema de pestañas funcional**
✅ **Modal de detalles con información completa**
✅ **Exportación preparada para PDF real**
✅ **Búsqueda de registros**
✅ **Diseño completamente responsivo**

## Notas de Implementación

1. **Estados de Carga**: Los componentes ya manejan estados de loading
2. **Manejo de Errores**: Agregar error boundaries si es necesario
3. **Cache**: Considerar implementar React Query o SWR para cache
4. **Validación**: Los tipos TypeScript aseguran validación en compile-time
5. **Testing**: Cada componente puede testearse independientemente

## Próximos Pasos

1. Implementar los endpoints API del backend
2. Reemplazar mocks con calls reales
3. Agregar manejo de errores robusto
4. Implementar cache/state management global si es necesario
5. Agregar tests unitarios para cada componente