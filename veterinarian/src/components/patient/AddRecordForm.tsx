import { useState } from 'react'

interface AddRecordFormProps {
  onSave: (data: any) => void
  onVoiceInput: () => void
}

type EntryType = '' | 'consulta' | 'vacuna' | 'procedimiento' | 'analisis' | 'cirugia' | 'emergencia'

export default function AddRecordForm({ onSave, onVoiceInput }: AddRecordFormProps) {
  const [entryType, setEntryType] = useState<EntryType>('')
  const [formData, setFormData] = useState({
    motivo: '',
    hallazgos: '',
    diagnostico: '',
    tratamiento: '',
    proximosPasos: '',
    notas: ''
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    if (!entryType) return
    onSave({ type: entryType, ...formData })
  }

  return (
    <div className="addRecordContainer">
      <div className="addRecordHeader">
        <h3 className="addRecordTitle">Nueva Entrada Médica</h3>
        <p className="addRecordSubtitle">Selecciona el tipo de dato y completa los campos correspondientes</p>
      </div>

      <div className="addRecordForm">
        <div className="formGroup">
          <label className="fieldLabel">Tipo de Entrada</label>
          <div className="selectWrapper">
            <select
              className="fieldSelect"
              value={entryType}
              onChange={(e) => setEntryType(e.target.value as EntryType)}
            >
              <option value="">Seleccionar tipo...</option>
              <option value="consulta">🩺 Consulta General</option>
              <option value="vacuna">💉 Vacunación</option>
              <option value="procedimiento">⚕️ Procedimiento</option>
              <option value="analisis">🔬 Análisis</option>
              <option value="cirugia">🏥 Cirugía</option>
              <option value="emergencia">🚨 Emergencia</option>
            </select>
          </div>
        </div>

        {entryType && (
          <>
            <div className="formGroup">
              <label className="fieldLabel">Motivo de consulta</label>
              <textarea
                className="fieldTextarea"
                placeholder="Describe el motivo de la consulta..."
                value={formData.motivo}
                onChange={(e) => handleInputChange('motivo', e.target.value)}
                rows={3}
              />
            </div>

            <div className="formGroup">
              <label className="fieldLabel">Hallazgos (Examen físico)</label>
              <textarea
                className="fieldTextarea"
                placeholder="Detalla los hallazgos del examen físico..."
                value={formData.hallazgos}
                onChange={(e) => handleInputChange('hallazgos', e.target.value)}
                rows={4}
              />
            </div>

            <div className="formGroup">
              <label className="fieldLabel">Diagnóstico</label>
              <textarea
                className="fieldTextarea"
                placeholder="Diagnóstico clínico..."
                value={formData.diagnostico}
                onChange={(e) => handleInputChange('diagnostico', e.target.value)}
                rows={3}
              />
            </div>

            <div className="formGroup">
              <label className="fieldLabel">Tratamiento</label>
              <textarea
                className="fieldTextarea"
                placeholder="Plan de tratamiento y medicación..."
                value={formData.tratamiento}
                onChange={(e) => handleInputChange('tratamiento', e.target.value)}
                rows={4}
              />
            </div>

            <div className="formGroup">
              <label className="fieldLabel">Próximos pasos</label>
              <textarea
                className="fieldTextarea"
                placeholder="Seguimiento y próximas citas..."
                value={formData.proximosPasos}
                onChange={(e) => handleInputChange('proximosPasos', e.target.value)}
                rows={3}
              />
            </div>

            <div className="formGroup">
              <label className="fieldLabel">Notas adicionales</label>
              <textarea
                className="fieldTextarea"
                placeholder="Observaciones adicionales..."
                value={formData.notas}
                onChange={(e) => handleInputChange('notas', e.target.value)}
                rows={3}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}