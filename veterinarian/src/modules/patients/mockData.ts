import type { Patient, PatientRecord, PatientDetails } from './types'

export const MOCK_PATIENTS: Patient[] = [
  {
    id: 'p1',
    name: 'Max',
    species: 'Perro',
    breed: 'Golden Retriever',
    ownerName: 'María González',
    avatarUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=120&h=120&fit=crop&auto=format',
    summary: 'Revisión general completada',
    age: '3 años',
    lastVisitAgo: "1 day",
    status: "hola"
  },
  {
    id: 'p2',
    name: 'Luna',
    species: 'Gato',
    breed: 'Persa',
    ownerName: 'Carlos Ruiz',
    avatarUrl: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=120&h=120&fit=crop&auto=format',
    summary: 'Medicación para infección ocular',
    age: '2 años',
    lastVisitAgo: "1 day",
    status: "hola"
  },
  {
    id: 'p3',
    name: 'Rocky',
    species: 'Perro',
    breed: 'Pastor Alemán',
    ownerName: 'Ana Martín',
    avatarUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=120&h=120&fit=crop&auto=format',
    summary: 'Vacunación anual aplicada',
    age: '5 años',
    lastVisitAgo: "1 day",
    status: "hola"
  },
  {
    id: 'p4',
    name: 'Mimi',
    species: 'Gato',
    breed: 'Siamés',
    ownerName: 'José López',
    avatarUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=120&h=120&fit=crop&auto=format',
    summary: 'Post-cirugía, evolución favorable',
    age: '4 años',
    lastVisitAgo: "1 day",
    status: "hola"
  },
  {
    id: 'p5',
    name: 'Simba',
    species: 'Gato',
    breed: 'Maine Coon',
    ownerName: 'Patricia Morales',
    avatarUrl: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=120&h=120&fit=crop&auto=format',
    summary: 'Control de peso exitoso',
    age: '6 años',
    lastVisitAgo: "1 day",
    status: "hola"
  },
  {
    id: 'p6',
    name: 'Zeus',
    species: 'Perro',
    breed: 'Doberman',
    ownerName: 'Ricardo Delgado',
    avatarUrl: 'https://images.unsplash.com/photo-1507149833265-60c372daea22?w=120&h=120&fit=crop&auto=format',
    summary: 'Control cardiológico rutinario',
    age: '8 años',
    lastVisitAgo: "1 day",
    status: "hola"
  },
]

export const MOCK_PATIENT_RECORDS: PatientRecord[] = [
  {
    id: 'r1',
    patientId: 'p1',
    date: '2024-01-14',
    title: 'Revisión general',
    doctor: 'Dr. Rodríguez',
    type: 'Consulta',
    description: 'Control de rutina. El paciente presenta buen estado general. Se realizaron análisis de sangre completos. Peso estable en 28kg. Se recomienda continuar con la dieta actual y ejercicio regular.',
    temperature: '38.5°C',
    weight: '28 kg',
    heartRate: '95 bpm',
    attachments: [
      { id: 'a1', name: 'analitica_completa.pdf', url: '#' },
      { id: 'a2', name: 'radiografia_torax.jpg', url: '#' }
    ]
  },
  {
    id: 'r2',
    patientId: 'p1',
    date: '2023-12-09',
    title: 'Vacuna anual',
    doctor: 'Dr. Rodríguez',
    type: 'Vacunación',
    description: 'Aplicación de vacuna polivalente anual (DHPP) y vacuna antirrábica. El paciente toleró bien el procedimiento. No se observaron reacciones adversas.',
    attachments: [
      { id: 'a3', name: 'certificado_vacuna.pdf', url: '#' }
    ]
  },
  {
    id: 'r3',
    patientId: 'p1',
    date: '2023-11-04',
    title: 'Desparasitación',
    doctor: 'Dra. Martín',
    type: 'Tratamiento',
    description: 'Tratamiento antiparasitario preventivo. Se administró medicación oral. Se programó seguimiento en 3 meses para nueva desparasitación.',
    medication: 'Drontal Plus - 1 comprimido',
    nextAppointment: '2024-02-04'
  },
  {
    id: 'r4',
    patientId: 'p1',
    date: '2023-09-15',
    title: 'Limpieza dental',
    doctor: 'Dra. García',
    type: 'Tratamiento',
    description: 'Profilaxis dental completa bajo anestesia. Se removió sarro acumulado y se realizó pulido dental. Estado dental general bueno.',
    anesthesia: 'Propofol + Isoflurano',
    duration: '45 minutos',
    attachments: [
      { id: 'a4', name: 'fotos_antes_despues.jpg', url: '#' }
    ]
  },
  {
    id: 'r5',
    patientId: 'p1',
    date: '2023-08-20',
    title: 'Control post-operatorio',
    doctor: 'Dr. Rodríguez',
    type: 'Consulta',
    description: 'Revisión de herida quirúrgica. Evolución favorable sin complicaciones.',
  },
  {
    id: 'r6',
    patientId: 'p1',
    date: '2023-07-10',
    title: 'Cirugía menor',
    doctor: 'Dra. García',
    type: 'Tratamiento',
    description: 'Extracción de quiste sebáceo en flanco izquierdo. Procedimiento exitoso.',
    anesthesia: 'Anestesia local',
    duration: '25 minutos'
  },
  {
    id: 'r7',
    patientId: 'p1',
    date: '2023-06-15',
    title: 'Vacuna polivalente',
    doctor: 'Dr. Rodríguez',
    type: 'Vacunación',
    description: 'Refuerzo de vacuna polivalente. Sin reacciones adversas observadas.',
  },
  {
    id: 'r8',
    patientId: 'p1',
    date: '2023-05-08',
    title: 'Control dermatológico',
    doctor: 'Dra. Martín',
    type: 'Consulta',
    description: 'Evaluación de dermatitis alérgica. Mejoría notable con el tratamiento.',
    medication: 'Apoquel 5.4mg - 1 comprimido cada 12 horas'
  },
  {
    id: 'r9',
    patientId: 'p1',
    date: '2023-04-22',
    title: 'Análisis de orina',
    doctor: 'Dr. Rodríguez',
    type: 'Consulta',
    description: 'Examen de rutina. Parámetros dentro de valores normales.',
    attachments: [
      { id: 'a5', name: 'resultado_orina.pdf', url: '#' }
    ]
  },
  {
    id: 'r10',
    patientId: 'p1',
    date: '2023-03-18',
    title: 'Desparasitación trimestral',
    doctor: 'Dra. García',
    type: 'Tratamiento',
    description: 'Administración de antiparasitario de amplio espectro.',
    medication: 'Milbemax - 1 comprimido'
  },
  {
    id: 'r11',
    patientId: 'p1',
    date: '2023-02-14',
    title: 'Control cardiológico',
    doctor: 'Dr. Rodríguez',
    type: 'Consulta',
    description: 'Electrocardiograma y auscultación. Función cardíaca normal.',
    attachments: [
      { id: 'a6', name: 'electrocardiograma.pdf', url: '#' }
    ]
  },
  {
    id: 'r12',
    patientId: 'p1',
    date: '2023-01-28',
    title: 'Vacuna antirrábica',
    doctor: 'Dra. Martín',
    type: 'Vacunación',
    description: 'Aplicación anual de vacuna antirrábica obligatoria.',
    attachments: [
      { id: 'a7', name: 'certificado_rabia.pdf', url: '#' }
    ]
  },
  {
    id: 'r13',
    patientId: 'p1',
    date: '2022-12-20',
    title: 'Radiografía de cadera',
    doctor: 'Dr. Rodríguez',
    type: 'Consulta',
    description: 'Estudio radiológico preventivo. Sin signos de displasia.',
    attachments: [
      { id: 'a8', name: 'radiografia_cadera.jpg', url: '#' }
    ]
  },
  {
    id: 'r14',
    patientId: 'p1',
    date: '2022-11-15',
    title: 'Limpieza de oídos',
    doctor: 'Dra. García',
    type: 'Tratamiento',
    description: 'Limpieza profunda de conducto auditivo. Aplicación de medicación tópica.',
    medication: 'Otomax - 3 gotas cada 12 horas por 7 días'
  },
  {
    id: 'r15',
    patientId: 'p1',
    date: '2022-10-10',
    title: 'Control nutricional',
    doctor: 'Dra. Martín',
    type: 'Consulta',
    description: 'Evaluación de dieta y peso. Recomendaciones nutricionales específicas.',
  },
  {
    id: 'r16',
    patientId: 'p1',
    date: '2022-09-25',
    title: 'Vacuna Lyme',
    doctor: 'Dr. Rodríguez',
    type: 'Vacunación',
    description: 'Vacuna preventiva contra enfermedad de Lyme.',
  },
  {
    id: 'r17',
    patientId: 'p1',
    date: '2022-08-12',
    title: 'Cirugía dental',
    doctor: 'Dra. García',
    type: 'Tratamiento',
    description: 'Extracción de pieza dental fracturada. Post-operatorio sin complicaciones.',
    anesthesia: 'Propofol + Isoflurano',
    duration: '60 minutos'
  },
  {
    id: 'r18',
    patientId: 'p1',
    date: '2022-07-18',
    title: 'Control oftalmológico',
    doctor: 'Dr. Rodríguez',
    type: 'Consulta',
    description: 'Examen ocular completo. Visión normal sin anomalías.',
  }
]

export const MOCK_PATIENT_DETAILS: Record<string, PatientDetails> = {
  p1: {
    weight: '26-30 kg',
    sex: 'Macho',
    birthDate: '14/3/2021',
    ownerPhone: '+34 666 123 456',
    ownerEmail: 'maria.gonzalez@email.com'
  }
}