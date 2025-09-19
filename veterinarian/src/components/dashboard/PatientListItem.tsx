import { useNavigate } from 'react-router-dom'
import type { Pet } from '../../services/petsService'
import { getAnimalAvatar } from '../../utils/animalUtils'

interface PatientListItemProps {
  pet: Pet
}

function formatAge(dateOfBirth: string): string {
  const birthDate = new Date(dateOfBirth)
  const today = new Date()
  const ageInYears = Math.floor((today.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25))

  if (ageInYears < 1) {
    const ageInMonths = Math.floor((today.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44))
    return `${ageInMonths} ${ageInMonths === 1 ? 'mes' : 'meses'}`
  }

  return `${ageInYears} ${ageInYears === 1 ? 'año' : 'años'}`
}

export default function PatientListItem({ pet }: PatientListItemProps) {
  const navigate = useNavigate()

  const handleClick = () => {
    console.log('Navigating to pet:', pet.id)
    navigate(`/pets/${pet.id}`)
  }

  const ownerName = pet.owners && pet.owners.length > 0 ? pet.owners[0].name : 'Sin dueño'
  const displaySpecies = pet.species === 'CAT' ? 'Gato' : pet.species === 'DOG' ? 'Perro' : pet.species
  const weightText = pet.weight ? `${pet.weight}kg` : 'Peso no registrado'

  return (
    <div
      className="patientItem"
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => { if (e.key === 'Enter') handleClick() }}
    >
      <div className="patientItem__left">
        <img
          className="patientItem__avatar"
          src={getAnimalAvatar(displaySpecies, pet.name, pet.profileImageUrl)}
          alt={pet.name}
        />
        <div className="patientItem__text">
          <div className="patientItem__name">{pet.name}</div>
          <div className="patientItem__meta">
            {ownerName} · {pet.breed || displaySpecies} · {weightText}
          </div>
        </div>
      </div>
      <div className="patientItem__right">
        <div className="patientItem__ago">{formatAge(pet.dateOfBirth)}</div>
        <div className="patientItem__status">Edad</div>
      </div>
    </div>
  )
}


