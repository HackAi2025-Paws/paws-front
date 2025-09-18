import type { Pet, FAQ, User, Reminder, ConsultationRecord } from '../types/index.js'

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
    age: '4 años',
    weight: {
      min: 28,
      max: 30,
      unit: 'kg'
    },
    gender: 'macho',
    notes: 'Muy activo, le gusta jugar en el parque. Alérgico a algunos alimentos.',
    observations: 'Presenta alergia alimentaria a pollo. Buen comportamiento general.',
    ownerId: '1',
    vaccinations: [
      {
        id: '1',
        petId: '1',
        name: 'Rabia',
        date: '2024-01-15',
        nextDue: '2025-01-15',
        veterinarian: 'Clínica Veterinaria',
        notes: 'Sin reacciones adversas'
      },
      {
        id: '2',
        petId: '1',
        name: 'Múltiple (DHPP)',
        date: '2024-02-20',
        nextDue: '2025-02-20',
        veterinarian: 'Clínica Veterinaria'
      }
    ],
    treatments: [
      {
        id: 't1',
        petId: '1',
        type: 'antiparasitario',
        name: 'Desparasitante oral',
        date: '2024-10-01',
        dose: '1 pastilla',
        veterinarian: 'Clínica Veterinaria'
      }
    ],
    appointments: [
      {
        id: '1',
        petId: '1',
        type: 'control',
        date: '2024-12-15',
        veterinarian: 'Clínica Veterinaria',
        notes: 'Control rutinario',
        status: 'programada'
      }
    ],
    documents: [
      {
        id: 'd1',
        petId: '1',
        name: 'Certificado de vacunación',
        type: 'certificado',
        uploadDate: '2024-01-15',
        veterinarian: 'Clínica Veterinaria'
      }
    ],
    consultationRecords: [
      {
        id: 'cr1',
        petId: '1',
        type: 'consulta',
        title: 'Revisión rutinaria y problema digestivo',
        date: '2024-10-15',
        veterinarian: 'Clínica Veterinaria',
        clinicName: 'Veterinaria San Martín',
        diagnosis: 'Gastroenteritis leve. Se detectó sensibilidad alimentaria. Estado general bueno.',
        prescription: 'Dieta blanda por 3 días. Probióticos durante 1 semana.',
        notes: 'Max presentó vómitos esporádicos. Se recomienda cambio gradual de alimento.',
        cost: 85,
        nextAppointment: '2024-11-15',
        createdBy: 'owner',
        createdAt: '2024-10-15T16:30:00Z'
      },
      {
        id: 'cr2',
        petId: '1',
        type: 'vacunacion',
        title: 'Vacuna antirrábica anual',
        date: '2024-01-15',
        veterinarian: 'Clínica Veterinaria',
        clinicName: 'Veterinaria San Martín',
        diagnosis: 'Aplicación exitosa de vacuna antirrábica. Sin reacciones adversas.',
        notes: 'Max se comportó muy bien durante la aplicación. Peso: 29kg.',
        cost: 35,
        createdBy: 'owner',
        createdAt: '2024-01-15T11:00:00Z'
      }
    ]
  },
  {
    id: '2',
    name: 'Luna',
    breed: 'Gato Persa',
    birthDate: '2021-07-22',
    age: '3 años',
    weight: {
      min: 4,
      max: 4.5,
      unit: 'kg'
    },
    gender: 'hembra',
    notes: 'Muy tranquila, le gusta dormir al sol. Necesita cepillado diario.',
    observations: 'Pelo largo requiere cepillado frecuente para evitar nudos.',
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
    treatments: [],
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
    ],
    documents: [],
    consultationRecords: [
      {
        id: 'cr3',
        petId: '2',
        type: 'estetica',
        title: 'Corte y limpieza dental',
        date: '2024-09-20',
        veterinarian: 'Dra. Rodriguez',
        clinicName: 'Clínica Veterinaria del Centro',
        diagnosis: 'Pelaje en buen estado. Se realizó limpieza dental preventiva.',
        notes: 'Luna se mantuvo tranquila durante el procedimiento. Excelente comportamiento.',
        cost: 120,
        createdBy: 'owner',
        createdAt: '2024-09-20T14:00:00Z'
      }
    ]
  },
  {
    id: '3',
    name: 'Rocky',
    breed: 'Bulldog Francés',
    birthDate: '2019-11-08',
    age: '5 años',
    weight: {
      min: 12,
      max: 12.5,
      unit: 'kg'
    },
    gender: 'macho',
    notes: 'Problemas respiratorios leves. Evitar ejercicio intenso en verano.',
    observations: 'Raza braquicéfala con dificultades respiratorias. Monitorear en clima caluroso.',
    ownerId: '1',
    vaccinations: [
      {
        id: '4',
        petId: '3',
        name: 'Rabia',
        date: '2024-03-05',
        nextDue: '2025-03-05',
        veterinarian: 'Clínica Veterinaria'
      }
    ],
    treatments: [],
    appointments: [],
    documents: [],
    consultationRecords: [
      {
        id: 'cr4',
        petId: '3',
        type: 'control',
        title: 'Control respiratorio',
        date: '2024-08-10',
        veterinarian: 'Clínica Veterinaria',
        clinicName: 'Veterinaria San Martín',
        diagnosis: 'Vías respiratorias ligeramente inflamadas. Típico de la raza. Recomendar evitar ejercicio intenso.',
        prescription: 'Antiinflamatorio suave por 5 días. Evitar calor excesivo.',
        notes: 'Rocky presentó jadeo excesivo después de caminar. Se recomienda ejercicio moderado.',
        cost: 70,
        nextAppointment: '2024-11-10',
        createdBy: 'owner',
        createdAt: '2024-08-10T10:30:00Z'
      }
    ]
  }
]

export const mockReminders: Reminder[] = []

export const mockFAQs: FAQ[] = [
  // Preguntas específicas para PERROS
  {
    id: '1',
    question: '¿Con qué frecuencia debo vacunar a mi perro?',
    answer: 'Los perros adultos necesitan vacunas anuales. Los cachorros requieren una serie de vacunas que comienzan a las 6-8 semanas de edad, con refuerzos cada 3-4 semanas hasta los 4 meses.',
    category: 'salud',
    species: ['perro']
  },
  {
    id: '4',
    question: '¿Con qué frecuencia debo bañar a mi perro?',
    answer: 'La mayoría de los perros necesitan un baño cada 4-6 semanas, aunque esto puede variar según la raza, estilo de vida y tipo de pelaje. Los perros con piel sensible pueden necesitar baños menos frecuentes.',
    category: 'cuidados',
    species: ['perro']
  },
  {
    id: '7',
    question: '¿Cuánto ejercicio necesita mi perro?',
    answer: 'Los perros necesitan al menos 30 minutos a 2 horas de ejercicio diario, dependiendo de la raza, edad y nivel de energía. Razas activas como Border Collie necesitan más ejercicio que razas más tranquilas.',
    category: 'cuidados',
    species: ['perro']
  },
  {
    id: '8',
    question: '¿Por qué mi perro come hierba?',
    answer: 'Es normal que los perros coman hierba ocasionalmente. Puede ser por instinto, aburrimiento, o para ayudar con la digestión. Si lo hace frecuentemente o vomita después, consulta al veterinario.',
    category: 'comportamiento',
    species: ['perro']
  },
  {
    id: '9',
    question: '¿Qué alimentos son tóxicos para los perros?',
    answer: 'Los perros no deben consumir chocolate, uvas, pasas, cebolla, ajo, aguacate, nueces de macadamia, alcohol, café y dulces con xilitol. Estos pueden ser muy tóxicos.',
    category: 'alimentacion',
    species: ['perro']
  },
  {
    id: '10',
    question: '¿Cuándo debe mi perro empezar el entrenamiento?',
    answer: 'El entrenamiento básico puede comenzar desde las 8 semanas de edad. La socialización temprana (3-6 meses) es crucial. Nunca es demasiado tarde para entrenar, pero es más fácil cuando son jóvenes.',
    category: 'comportamiento',
    species: ['perro']
  },

  // Preguntas específicas para GATOS
  {
    id: '2',
    question: '¿Qué alimentos son tóxicos para los gatos?',
    answer: 'Los gatos no deben consumir chocolate, cebolla, ajo, uvas, pasas, alcohol, cafeína, aguacate y productos lácteos en exceso. Estos pueden ser tóxicos o causarles problemas digestivos.',
    category: 'alimentacion',
    species: ['gato']
  },
  {
    id: '11',
    question: '¿Con qué frecuencia debo limpiar la caja de arena?',
    answer: 'La caja de arena debe limpiarse diariamente, removiendo los desechos sólidos y la arena aglomerada. Un cambio completo de arena debe hacerse semanalmente.',
    category: 'cuidados',
    species: ['gato']
  },
  {
    id: '12',
    question: '¿Por qué mi gato ronronea?',
    answer: 'Los gatos ronronean cuando están contentos, relajados o buscan atención. También pueden ronronear cuando están estresados o enfermos como mecanismo de autoconsuelo.',
    category: 'comportamiento',
    species: ['gato']
  },
  {
    id: '13',
    question: '¿Necesita mi gato salir al exterior?',
    answer: 'Los gatos pueden vivir felizmente en interiores. Si vive adentro, proporciona estímulos como rascadores, juguetes y lugares altos. El exterior puede ser peligroso (tráfico, predadores, enfermedades).',
    category: 'cuidados',
    species: ['gato']
  },
  {
    id: '14',
    question: '¿Cuándo debo esterilizar a mi gato?',
    answer: 'La esterilización se recomienda entre los 4-6 meses de edad, antes del primer celo. Previene embarazos no deseados y reduce el riesgo de ciertos cánceres y comportamientos territoriales.',
    category: 'salud',
    species: ['gato']
  },
  {
    id: '15',
    question: '¿Por qué mi gato araña los muebles?',
    answer: 'Arañar es natural en gatos: marcan territorio, mantienen sus uñas saludables y se estiran. Proporciona rascadores atractivos y usa repelentes naturales en muebles.',
    category: 'comportamiento',
    species: ['gato']
  },

  // Preguntas GENERALES (aplican a ambos)
  {
    id: '3',
    question: '¿Cuándo debo preocuparme por el comportamiento de mi mascota?',
    answer: 'Busca ayuda si observas cambios súbitos en el apetito, letargo, agresividad inusual, vómitos frecuentes, dificultad para respirar o cualquier comportamiento muy diferente al normal.',
    category: 'comportamiento',
    species: ['perro', 'gato', 'general']
  },
  {
    id: '5',
    question: '¿Qué debo hacer en caso de emergencia?',
    answer: 'En emergencias, mantén la calma, contacta inmediatamente a tu veterinario o clínica de emergencia más cercana. Ten siempre a mano números de teléfono de emergencia veterinaria.',
    category: 'emergencias',
    species: ['perro', 'gato', 'general']
  },
  {
    id: '6',
    question: '¿Cuánta comida debo darle a mi mascota?',
    answer: 'La cantidad depende de la edad, peso, nivel de actividad y tipo de alimento. Consulta las instrucciones del fabricante y ajusta según las recomendaciones de tu veterinario.',
    category: 'alimentacion',
    species: ['perro', 'gato', 'general']
  },
  {
    id: '16',
    question: '¿Con qué frecuencia debo llevar mi mascota al veterinario?',
    answer: 'Mascotas adultas y sanas deben ir al veterinario al menos una vez al año para chequeos. Cachorros, gatitos y mascotas mayores (7+ años) necesitan visitas más frecuentes.',
    category: 'salud',
    species: ['perro', 'gato', 'general']
  },
  {
    id: '17',
    question: '¿Cómo puedo saber si mi mascota tiene dolor?',
    answer: 'Signos de dolor incluyen: cambios en el apetito, letargo, jadeo excesivo, vocalización inusual, cojera, cambios posturales, o evitar actividades normales. Consulta al veterinario si notas estos signos.',
    category: 'salud',
    species: ['perro', 'gato', 'general']
  },
  {
    id: '18',
    question: '¿Qué debo tener en un botiquín de primeros auxilios para mascotas?',
    answer: 'Incluye: gasas, vendas, antiséptico, termómetro, jeringas sin aguja, manta, números de emergencia veterinaria, y cualquier medicamento específico de tu mascota.',
    category: 'emergencias',
    species: ['perro', 'gato', 'general']
  }
]

