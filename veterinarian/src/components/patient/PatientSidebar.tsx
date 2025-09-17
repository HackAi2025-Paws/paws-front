import type { Patient, PatientDetails } from '../../modules/patients/types'

interface PatientSidebarProps {
  patient: Patient
  patientDetails?: PatientDetails
  onExportClick: () => void
}

export default function PatientSidebar({ patient, patientDetails, onExportClick }: PatientSidebarProps) {
  return (
    <div className="petPage__sidebar">
      <img className="petPage__avatar" src={patient.avatarUrl} alt={patient.name} />
      <div className="petPage__nameRow">
        <h2 className="petPage__name">{patient.name}</h2>
      </div>
      <div className="petPage__meta">{patient.breed ?? patient.species} · {patient.age}</div>

      <div className="infoGrid">
        <div className="infoBox">
          <div className="infoBox__label">PESO</div>
          <div className="infoBox__value">{patientDetails?.weight || '26-30 kg'}</div>
        </div>
        <div className="infoBox">
          <div className="infoBox__label">SEXO</div>
          <div className="infoBox__value">{patientDetails?.sex || 'Macho'}</div>
        </div>
        <div className="infoBox infoBox--full">
          <div className="infoBox__label">NACIMIENTO</div>
          <div className="infoBox__value">{patientDetails?.birthDate || '14/3/2021'}</div>
        </div>
      </div>

      <div className="owner">
        <div className="owner__title">Propietario</div>
        <div className="owner__row">{patient.ownerName}</div>
        <div className="owner__row">{patientDetails?.ownerPhone || '+34 666 123 456'}</div>
      </div>

      <div className="centerRow">
        <button className="btn btn--primary" type="button" onClick={onExportClick}>
          Exportar PDF
        </button>
      </div>
    </div>
  )
}