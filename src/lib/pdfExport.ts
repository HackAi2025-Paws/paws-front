import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import type { Pet } from '../types/index.js'

/**
 * Genera un PDF con el historial completo de una mascota
 */
export async function exportPetHistoryToPDF(pet: Pet): Promise<void> {
  const pdf = new jsPDF('p', 'mm', 'a4')
  
  // Configuración
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const margin = 20
  const contentWidth = pageWidth - (margin * 2)
  let yPosition = margin

  // Función para agregar nueva página si es necesario
  const checkPageBreak = (requiredHeight: number): number => {
    if (yPosition + requiredHeight > pageHeight - margin) {
      pdf.addPage()
      return margin
    }
    return yPosition
  }

  // Encabezado del documento
  pdf.setFontSize(20)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Historial Médico', margin, yPosition)
  yPosition += 10

  pdf.setFontSize(16)
  pdf.setFont('helvetica', 'normal')
  pdf.text(`${pet.name} - ${pet.breed}`, margin, yPosition)
  yPosition += 15

  // Información básica
  pdf.setFontSize(14)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Información Básica', margin, yPosition)
  yPosition += 8

  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')
  
  const basicInfo = [
    `Nombre: ${pet.name}`,
    `Raza: ${pet.breed}`,
    `Edad: ${pet.age} años`,
    `Peso: ${pet.weight.min}-${pet.weight.max} ${pet.weight.unit}`,
    `Género: ${pet.gender}`,
    `Fecha de nacimiento: ${new Date(pet.birthDate).toLocaleDateString('es-ES')}`
  ]

  basicInfo.forEach(info => {
    yPosition = checkPageBreak(6)
    pdf.text(info, margin, yPosition)
    yPosition += 6
  })

  yPosition += 10

  // Vacunas
  if (pet.vaccinations.length > 0) {
    yPosition = checkPageBreak(20)
    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Historial de Vacunas', margin, yPosition)
    yPosition += 10

    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')

    pet.vaccinations.forEach(vaccine => {
      yPosition = checkPageBreak(20)
      pdf.setFont('helvetica', 'bold')
      pdf.text(`• ${vaccine.name}`, margin, yPosition)
      yPosition += 5
      
      pdf.setFont('helvetica', 'normal')
      pdf.text(`  Fecha: ${new Date(vaccine.date).toLocaleDateString('es-ES')}`, margin, yPosition)
      yPosition += 4
      
      if (vaccine.veterinarian) {
        pdf.text(`  Veterinario: ${vaccine.veterinarian}`, margin, yPosition)
        yPosition += 4
      }
      
      if (vaccine.nextDue) {
        pdf.text(`  Próxima dosis: ${new Date(vaccine.nextDue).toLocaleDateString('es-ES')}`, margin, yPosition)
        yPosition += 4
      }
      
      if (vaccine.notes) {
        pdf.text(`  Notas: ${vaccine.notes}`, margin, yPosition)
        yPosition += 4
      }
      
      yPosition += 3
    })
  }

  // Tratamientos
  if (pet.treatments.length > 0) {
    yPosition = checkPageBreak(20)
    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Historial de Tratamientos', margin, yPosition)
    yPosition += 10

    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')

    pet.treatments.forEach(treatment => {
      yPosition = checkPageBreak(25)
      pdf.setFont('helvetica', 'bold')
      pdf.text(`• ${treatment.name}`, margin, yPosition)
      yPosition += 5
      
      pdf.setFont('helvetica', 'normal')
      pdf.text(`  Tipo: ${treatment.type}`, margin, yPosition)
      yPosition += 4
      
      pdf.text(`  Fecha: ${new Date(treatment.date).toLocaleDateString('es-ES')}`, margin, yPosition)
      yPosition += 4
      
      if (treatment.dose) {
        pdf.text(`  Dosis: ${treatment.dose}`, margin, yPosition)
        yPosition += 4
      }
      
      if (treatment.frequency) {
        pdf.text(`  Frecuencia: ${treatment.frequency}`, margin, yPosition)
        yPosition += 4
      }
      
      if (treatment.duration) {
        pdf.text(`  Duración: ${treatment.duration}`, margin, yPosition)
        yPosition += 4
      }
      
      if (treatment.veterinarian) {
        pdf.text(`  Veterinario: ${treatment.veterinarian}`, margin, yPosition)
        yPosition += 4
      }
      
      if (treatment.notes) {
        pdf.text(`  Notas: ${treatment.notes}`, margin, yPosition)
        yPosition += 4
      }
      
      yPosition += 3
    })
  }

  // Citas médicas
  if (pet.appointments.length > 0) {
    yPosition = checkPageBreak(20)
    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Historial de Citas', margin, yPosition)
    yPosition += 10

    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')

    pet.appointments.forEach(appointment => {
      yPosition = checkPageBreak(20)
      pdf.setFont('helvetica', 'bold')
      pdf.text(`• ${appointment.type}`, margin, yPosition)
      yPosition += 5
      
      pdf.setFont('helvetica', 'normal')
      pdf.text(`  Fecha: ${new Date(appointment.date).toLocaleDateString('es-ES')}`, margin, yPosition)
      yPosition += 4
      
      pdf.text(`  Estado: ${appointment.status}`, margin, yPosition)
      yPosition += 4
      
      if (appointment.veterinarian) {
        pdf.text(`  Veterinario: ${appointment.veterinarian}`, margin, yPosition)
        yPosition += 4
      }
      
      if (appointment.notes) {
        pdf.text(`  Notas: ${appointment.notes}`, margin, yPosition)
        yPosition += 4
      }
      
      yPosition += 3
    })
  }

  // Observaciones
  if (pet.observations) {
    yPosition = checkPageBreak(20)
    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Observaciones', margin, yPosition)
    yPosition += 10

    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    
    // Dividir las observaciones en líneas que quepan en el ancho de la página
    const observationLines = pdf.splitTextToSize(pet.observations, contentWidth)
    observationLines.forEach((line: string) => {
      yPosition = checkPageBreak(6)
      pdf.text(line, margin, yPosition)
      yPosition += 6
    })
  }

  // Pie de página con fecha de generación
  const currentDate = new Date().toLocaleDateString('es-ES')
  const currentTime = new Date().toLocaleTimeString('es-ES')
  
  pdf.setFontSize(8)
  pdf.setFont('helvetica', 'italic')
  pdf.text(`Generado el ${currentDate} a las ${currentTime} por Paws App`, margin, pageHeight - 10)

  // Descargar el PDF
  const fileName = `historial_${pet.name.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
  pdf.save(fileName)
}

/**
 * Genera un PDF con el historial de todas las mascotas del usuario
 */
export async function exportAllPetsHistoryToPDF(pets: Pet[]): Promise<void> {
  const pdf = new jsPDF('p', 'mm', 'a4')
  
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const margin = 20
  let yPosition = margin

  // Función para agregar nueva página si es necesario
  const checkPageBreak = (requiredHeight: number): number => {
    if (yPosition + requiredHeight > pageHeight - margin) {
      pdf.addPage()
      return margin
    }
    return yPosition
  }

  // Encabezado del documento
  pdf.setFontSize(20)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Historial Médico Completo', margin, yPosition)
  yPosition += 10

  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'normal')
  pdf.text(`Resumen de ${pets.length} mascota${pets.length !== 1 ? 's' : ''}`, margin, yPosition)
  yPosition += 20

  // Para cada mascota, generar un resumen
  pets.forEach((pet, index) => {
    if (index > 0) {
      yPosition = checkPageBreak(50) // Asegurar espacio para nueva mascota
      if (yPosition === margin) {
        // Nueva página, no necesitamos separador
      } else {
        // Separador entre mascotas
        pdf.setDrawColor(200, 200, 200)
        pdf.line(margin, yPosition, pageWidth - margin, yPosition)
        yPosition += 10
      }
    }

    // Información de la mascota
    pdf.setFontSize(16)
    pdf.setFont('helvetica', 'bold')
    pdf.text(`${pet.name} (${pet.breed})`, margin, yPosition)
    yPosition += 10

    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    
    // Resumen estadístico
    const stats = [
      `Edad: ${pet.age} años`,
      `Vacunas aplicadas: ${pet.vaccinations.length}`,
      `Tratamientos: ${pet.treatments.length}`,
      `Citas médicas: ${pet.appointments.length}`
    ]

    stats.forEach(stat => {
      yPosition = checkPageBreak(6)
      pdf.text(`• ${stat}`, margin, yPosition)
      yPosition += 6
    })

    yPosition += 10
  })

  // Pie de página
  const currentDate = new Date().toLocaleDateString('es-ES')
  const currentTime = new Date().toLocaleTimeString('es-ES')
  
  pdf.setFontSize(8)
  pdf.setFont('helvetica', 'italic')
  pdf.text(`Generado el ${currentDate} a las ${currentTime} por Paws App`, margin, pageHeight - 10)

  // Descargar el PDF
  const fileName = `historial_completo_${new Date().toISOString().split('T')[0]}.pdf`
  pdf.save(fileName)
}

/**
 * Genera un PDF del historial médico con diseño más profesional usando HTML2Canvas
 */
export async function exportPetHistoryWithCanvasToPDF(petId: string): Promise<void> {
  try {
    // Crear un elemento temporal con el contenido del historial
    const tempDiv = document.createElement('div')
    tempDiv.style.position = 'absolute'
    tempDiv.style.left = '-9999px'
    tempDiv.style.width = '800px'
    tempDiv.style.backgroundColor = 'white'
    tempDiv.style.padding = '20px'
    tempDiv.style.fontFamily = 'Arial, sans-serif'
    
    // Aquí podrías obtener los datos de la mascota y generar HTML
    tempDiv.innerHTML = `
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #2563eb; margin: 0;">Historial Médico</h1>
        <p style="color: #6b7280; margin: 5px 0;">Generado por Paws App</p>
      </div>
      <div>
        <p>Este método permite generar PDFs con mejor diseño usando HTML y CSS.</p>
        <p>ID de mascota: ${petId}</p>
      </div>
    `
    
    document.body.appendChild(tempDiv)
    
    // Convertir HTML a canvas
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff'
    })
    
    // Remover elemento temporal
    document.body.removeChild(tempDiv)
    
    // Crear PDF
    const pdf = new jsPDF('p', 'mm', 'a4')
    const imgWidth = 210 // A4 width in mm
    const pageHeight = 297 // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight
    
    let position = 0
    
    // Agregar la imagen del canvas al PDF
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight
    
    // Si el contenido es más alto que una página, agregar páginas adicionales
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }
    
    // Descargar el PDF
    pdf.save(`historial_mascota_${petId}.pdf`)
    
  } catch (error) {
    console.error('Error al generar PDF:', error)
    throw new Error('No se pudo generar el PDF')
  }
}
