/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react'

interface AddRecordFormProps {
  onSave: (data: any) => void
  onVoiceInput: () => void
}

type EntryType = '' | 'consulta' | 'vacuna' | 'tratamiento' | 'control' | 'emergencia' | 'cirugia' | 'estetica' | 'revision'

export default function AddRecordForm({ onSave, onVoiceInput }: AddRecordFormProps) {
  const [entryType, setEntryType] = useState<EntryType>('consulta')
  const [formData, setFormData] = useState({
    motivo: '',
    hallazgos: '',
    diagnostico: '',
    tratamiento: '',
    proximosPasos: '',
    notas: ''
  })
  let _ = onSave;
  _ = onVoiceInput;
  _.toString();
  const [files, setFiles] = useState<File[]>([])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      const remainingSlots = 5 - files.length

      if (newFiles.length > remainingSlots) {
        alert(`Solo puedes cargar ${remainingSlots} archivo(s) más. Máximo 5 archivos por consulta.`)
        const limitedFiles = newFiles.slice(0, remainingSlots)
        setFiles([...files, ...limitedFiles])
      } else {
        setFiles([...files, ...newFiles])
      }
    }
  }

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  return (
    <div className="addRecordContainer">

      <div className="addRecordForm">
        <div className="formGroup">
          <label className="fieldLabel">Tipo de Entrada</label>
          <div className="selectWrapper">
            <select
              className="fieldSelect"
              value={entryType}
              onChange={(e) => setEntryType(e.target.value as EntryType)}
            >
              <option value="consulta">🩺 Consulta General</option>
              <option value="vacuna">💉 Vacunación</option>
              <option value="tratamiento">💊 Tratamiento</option>
              <option value="control">📋 Control</option>
              <option value="emergencia">🚨 Emergencia</option>
              <option value="cirugia">🔪 Cirugía</option>
              <option value="estetica">✂️ Estética</option>
              <option value="revision">🔍 Revisión</option>
            </select>
          </div>
        </div>

        <>
            <div className="formGroup">
              <label className="fieldLabel">Motivo de consulta *</label>
              <textarea
                className="fieldTextarea"
                placeholder="Describe el motivo de la consulta..."
                value={formData.motivo}
                onChange={(e) => handleInputChange('motivo', e.target.value)}
                rows={3}
                required
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

            <div className="formGroup">
              <label className="fieldLabel">Archivos adjuntos ({files.length}/5)</label>
              <div className="fileUploadSection">
                <input
                  type="file"
                  id="fileUpload"
                  multiple
                  className="fileInput"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  disabled={files.length >= 5}
                />
                <label
                  htmlFor="fileUpload"
                  className={`fileUploadButton ${files.length >= 5 ? 'fileUploadButton--disabled' : ''}`}
                >
                  📎 Seleccionar archivos {files.length >= 5 ? '(Máximo alcanzado)' : ''}
                </label>

                {files.length > 0 && (
                  <div className="fileList">
                    {files.map((file, index) => (
                      <div key={index} className="fileItem">
                        <span className="fileName">{file.name}</span>
                        <button
                          type="button"
                          className="removeFileButton"
                          onClick={() => handleRemoveFile(index)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
      </div>
    </div>
  )
}