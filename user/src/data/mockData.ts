import type { Pet, FAQ, User, Reminder } from '../types/index.js'

export const mockUser: User = {
  id: '1',
  name: 'Ana García',
  email: 'ana.garcia@email.com'
}

export const mockPets: Pet[] = []

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

