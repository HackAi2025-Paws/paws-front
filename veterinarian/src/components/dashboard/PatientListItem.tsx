import type { Patient } from '../../modules/patients/types'
import { useNavigate } from 'react-router-dom'

export default function PatientListItem({ patient }: { patient: Patient }) {
  const navigate = useNavigate()
  return (
    <div className="patientItem" role="button" tabIndex={0} onClick={() => navigate(`/pets/${patient.id}`)} onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/pets/${patient.id}`) }}>
      <div className="patientItem__left">
        <img className="patientItem__avatar" src={patient.avatarUrl} alt={patient.name} />
        <div className="patientItem__text">
          <div className="patientItem__name">{patient.name}</div>
          <div className="patientItem__meta">
            {patient.ownerName} · {patient.breed ?? patient.species} · {patient.summary}
          </div>
        </div>
      </div>
      <div className="patientItem__right">
        <div className="patientItem__ago">{patient.lastVisitAgo}</div>
        <div className="patientItem__status">{patient.status}</div>
      </div>
    </div>
  )
}


