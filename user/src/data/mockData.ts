import type { Pet, FAQ, ChatConversation, User, Reminder } from '../types/index.js'

export const mockUser: User = {
  id: '1',
  name: 'Ana García',
  email: 'ana.garcia@email.com'
}

export const mockPets: Pet[] = [
  {
    id: '1',
    name: 'Max',
    breed: 'Golden Retriever',
    birthDate: '2020-03-15',
    weight: 28.5,
    notes: 'Muy activo, le gusta jugar en el parque. Alérgico a algunos alimentos.',
    ownerId: '1',
    vaccinations: [
      {
        id: '1',
        petId: '1',
        name: 'Rabia',
        date: '2024-01-15',
        nextDue: '2025-01-15',
        veterinarian: 'Dr. Martinez',
        notes: 'Sin reacciones adversas'
      },
      {
        id: '2',
        petId: '1',
        name: 'Múltiple (DHPP)',
        date: '2024-02-20',
        nextDue: '2025-02-20',
        veterinarian: 'Dr. Martinez'
      }
    ],
    appointments: [
      {
        id: '1',
        petId: '1',
        type: 'control',
        date: '2024-12-15',
        veterinarian: 'Dr. Martinez',
        notes: 'Control rutinario',
        status: 'programada'
      }
    ]
  },
  {
    id: '2',
    name: 'Luna',
    breed: 'Gato Persa',
    birthDate: '2021-07-22',
    weight: 4.2,
    notes: 'Muy tranquila, le gusta dormir al sol. Necesita cepillado diario.',
    ownerId: '1',
    vaccinations: [
      {
        id: '3',
        petId: '2',
        name: 'Triple Felina',
        date: '2024-01-10',
        nextDue: '2025-01-10',
        veterinarian: 'Dra. Rodriguez'
      }
    ],
    appointments: [
      {
        id: '2',
        petId: '2',
        type: 'vacuna',
        date: '2024-11-20',
        veterinarian: 'Dra. Rodriguez',
        notes: 'Vacuna anual triple felina',
        status: 'programada'
      }
    ]
  },
  {
    id: '3',
    name: 'Rocky',
    breed: 'Bulldog Francés',
    birthDate: '2019-11-08',
    weight: 12.1,
    notes: 'Problemas respiratorios leves. Evitar ejercicio intenso en verano.',
    ownerId: '1',
    vaccinations: [
      {
        id: '4',
        petId: '3',
        name: 'Rabia',
        date: '2024-03-05',
        nextDue: '2025-03-05',
        veterinarian: 'Dr. Martinez'
      }
    ],
    appointments: []
  }
]

export const mockReminders: Reminder[] = [
  {
    id: '1',
    petId: '1',
    type: 'appointment',
    title: 'Control veterinario - Max',
    description: 'Control rutinario programado con Dr. Martinez',
    date: '2024-12-15',
    isCompleted: false
  },
  {
    id: '2',
    petId: '2',
    type: 'vaccination',
    title: 'Vacuna Triple Felina - Luna',
    description: 'Vacuna anual con Dra. Rodriguez',
    date: '2024-11-20',
    isCompleted: false
  },
  {
    id: '3',
    petId: '1',
    type: 'medication',
    title: 'Desparasitación - Max',
    description: 'Administrar desparasitante mensual',
    date: '2024-10-30',
    isCompleted: true
  }
]

export const mockFAQs: FAQ[] = [
  {
    id: '1',
    question: '¿Con qué frecuencia debo vacunar a mi perro?',
    answer: 'Los perros adultos necesitan vacunas anuales. Los cachorros requieren una serie de vacunas que comienzan a las 6-8 semanas de edad, con refuerzos cada 3-4 semanas hasta los 4 meses.',
    category: 'salud'
  },
  {
    id: '2',
    question: '¿Qué alimentos son tóxicos para los gatos?',
    answer: 'Los gatos no deben consumir chocolate, cebolla, ajo, uvas, pasas, alcohol, cafeína, aguacate y productos lácteos en exceso. Estos pueden ser tóxicos o causarles problemas digestivos.',
    category: 'alimentacion'
  },
  {
    id: '3',
    question: '¿Cuándo debo preocuparme por el comportamiento de mi mascota?',
    answer: 'Busca ayuda si observas cambios súbitos en el apetito, letargo, agresividad inusual, vómitos frecuentes, dificultad para respirar o cualquier comportamiento muy diferente al normal.',
    category: 'comportamiento'
  },
  {
    id: '4',
    question: '¿Con qué frecuencia debo bañar a mi perro?',
    answer: 'La mayoría de los perros necesitan un baño cada 4-6 semanas, aunque esto puede variar según la raza, estilo de vida y tipo de pelaje. Los perros con piel sensible pueden necesitar baños menos frecuentes.',
    category: 'cuidados'
  },
  {
    id: '5',
    question: '¿Qué debo hacer en caso de emergencia?',
    answer: 'En emergencias, mantén la calma, contacta inmediatamente a tu veterinario o clínica de emergencia más cercana. Ten siempre a mano números de teléfono de emergencia veterinaria.',
    category: 'emergencias'
  },
  {
    id: '6',
    question: '¿Cuánta comida debo darle a mi mascota?',
    answer: 'La cantidad depende de la edad, peso, nivel de actividad y tipo de alimento. Consulta las instrucciones del fabricante y ajusta según las recomendaciones de tu veterinario.',
    category: 'alimentacion'
  }
]

export const mockChatConversations: ChatConversation[] = [
  {
    id: '1',
    participantName: 'Dr. Martinez',
    unreadCount: 2,
    messages: [
      {
        id: '1',
        text: 'Hola! ¿En qué puedo ayudarte hoy?',
        sender: 'vet',
        timestamp: '2024-10-15T09:00:00Z'
      },
      {
        id: '2',
        text: 'Hola Doctor, tengo una pregunta sobre Max. Ha estado un poco decaído últimamente.',
        sender: 'user',
        timestamp: '2024-10-15T09:05:00Z'
      },
      {
        id: '3',
        text: '¿Desde cuándo notas este cambio? ¿Ha tenido cambios en su apetito o actividad?',
        sender: 'vet',
        timestamp: '2024-10-15T09:07:00Z'
      },
      {
        id: '4',
        text: 'Desde hace unos 3 días. Come normal pero no quiere jugar tanto como antes.',
        sender: 'user',
        timestamp: '2024-10-15T09:10:00Z'
      },
      {
        id: '5',
        text: 'Te recomiendo que lo traigas para un chequeo. Podría ser algo menor, pero es mejor asegurarnos.',
        sender: 'vet',
        timestamp: '2024-10-15T09:15:00Z'
      },
      {
        id: '6',
        text: 'Perfecto, ¿tienes disponibilidad esta semana?',
        sender: 'user',
        timestamp: '2024-10-15T09:17:00Z'
      }
    ],
    lastMessage: {
      id: '6',
      text: 'Perfecto, ¿tienes disponibilidad esta semana?',
      sender: 'user',
      timestamp: '2024-10-15T09:17:00Z'
    }
  }
]
