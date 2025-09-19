import jsPDF from 'jspdf'
import type { ExportOptions } from '../modules/patients/types'
import { formatDateSafe } from '../utils/dateUtils'

export interface PDFPatientData {
  id: number
  name: string
  species: string
  breed?: string
  age: string
  owners: Array<{
    name: string
    phone: string
  }>
  weight?: number
  sex: string
  dateOfBirth?: string
  consultations?: Array<{
    id: number
    date: string
    consultationType: string
    chiefComplaint: string
    findings?: string
    diagnosis?: string
    nextSteps?: string
    additionalNotes?: string
    user?: {
      name: string
    }
  }>
  vaccines?: Array<{
    id: number
    vaccine: {
      name: string
    }
    applicationDate: string
    expirationDate?: string
  }>
  treatments?: Array<{
    id: number
    name: string
    startDate: string
    endDate?: string
  }>
  clinicalSummary?: {
    basic_information: string
    history: string
    last_consultation: string
  }
}

export class PDFService {
  private doc: jsPDF
  private currentY: number = 20
  private pageHeight: number = 280
  private margin: number = 20

  constructor() {
    this.doc = new jsPDF()
  }

  private addTitle(title: string) {
    this.doc.setFontSize(20)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text(title, this.margin, this.currentY)
    this.currentY += 15
  }

  private addSubtitle(subtitle: string) {
    this.checkPageBreak(10)
    this.doc.setFontSize(14)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text(subtitle, this.margin, this.currentY)
    this.currentY += 10
  }

  private addText(text: string, isBold = false) {
    this.checkPageBreak(7)
    this.doc.setFontSize(10)
    this.doc.setFont('helvetica', isBold ? 'bold' : 'normal')

    // Handle long text by splitting it
    const splitText = this.doc.splitTextToSize(text, 170)
    this.doc.text(splitText, this.margin, this.currentY)
    this.currentY += splitText.length * 5
  }

  private addLine() {
    this.checkPageBreak(5)
    this.doc.line(this.margin, this.currentY, 190, this.currentY)
    this.currentY += 8
  }

  private checkPageBreak(neededSpace: number) {
    if (this.currentY + neededSpace > this.pageHeight) {
      this.doc.addPage()
      this.currentY = 20
    }
  }

  private formatDate(dateString: string): string {
    return formatDateSafe(dateString)
  }

  private getConsultationType(type: string): string {
    const typeMap: Record<string, string> = {
      'GENERAL_CONSULTATION': 'Consulta General',
      'VACCINATION': 'Vacunación',
      'TREATMENT': 'Tratamiento',
      'CHECKUP': 'Control',
      'EMERGENCY': 'Emergencia',
      'SURGERY': 'Cirugía',
      'AESTHETIC': 'Estética',
      'REVIEW': 'Revisión'
    }
    return typeMap[type] || type
  }

  generatePatientPDF(patient: PDFPatientData, options: ExportOptions): void {
    // Header
    this.addTitle(`Historial Médico - ${patient.name}`)
    this.addLine()

    // Basic Information
    this.addSubtitle('Información Básica')
    this.addText(`Nombre: ${patient.name}`, true)
    this.addText(`Especie: ${patient.species}`)
    if (patient.breed) this.addText(`Raza: ${patient.breed}`)
    this.addText(`Edad: ${patient.age}`)
    if (patient.weight) this.addText(`Peso: ${patient.weight}kg`)
    this.addText(`Sexo: ${patient.sex}`)
    if (patient.dateOfBirth) this.addText(`Fecha de Nacimiento: ${this.formatDate(patient.dateOfBirth)}`)

    if (patient.owners && patient.owners.length > 0) {
      this.addText(`Propietario: ${patient.owners[0].name}`, true)
      this.addText(`Teléfono: ${patient.owners[0].phone}`)
    }

    this.currentY += 5
    this.addLine()

    // Clinical Summary
    if (options.resumen && patient.clinicalSummary) {
      this.addSubtitle('Resumen Clínico')

      this.addText('Información Básica:', true)
      this.addText(patient.clinicalSummary.basic_information)
      this.currentY += 3

      this.addText('Historial:', true)
      this.addText(patient.clinicalSummary.history)
      this.currentY += 3

      this.addText('Última Consulta:', true)
      this.addText(patient.clinicalSummary.last_consultation)

      this.currentY += 5
      this.addLine()
    }

    // Medical History
    if (options.historia && patient.consultations && patient.consultations.length > 0) {
      this.addSubtitle('Historia Clínica')

      patient.consultations.slice().reverse().forEach((consultation, index) => {
        this.checkPageBreak(25)

        this.addText(`${index + 1}. ${consultation.chiefComplaint}`, true)
        this.addText(`Fecha: ${this.formatDate(consultation.date)}`)
        this.addText(`Tipo: ${this.getConsultationType(consultation.consultationType)}`)
        if (consultation.user?.name) {
          this.addText(`Doctor: ${consultation.user.name}`)
        }

        if (consultation.findings) {
          this.addText(`Hallazgos: ${consultation.findings}`)
        }
        if (consultation.diagnosis) {
          this.addText(`Diagnóstico: ${consultation.diagnosis}`)
        }
        if (consultation.nextSteps) {
          this.addText(`Próximos pasos: ${consultation.nextSteps}`)
        }
        if (consultation.additionalNotes) {
          this.addText(`Notas adicionales: ${consultation.additionalNotes}`)
        }

        this.currentY += 8
      })

      this.addLine()
    }

    // Vaccines
    if (options.vacunas && patient.vaccines && patient.vaccines.length > 0) {
      this.addSubtitle('Registro de Vacunas')

      patient.vaccines.forEach((vaccine, index) => {
        this.checkPageBreak(15)

        this.addText(`${index + 1}. ${vaccine.vaccine.name}`, true)
        this.addText(`Fecha de aplicación: ${this.formatDate(vaccine.applicationDate)}`)
        if (vaccine.expirationDate) {
          const isExpired = new Date(vaccine.expirationDate) <= new Date()
          this.addText(`Fecha de expiración: ${this.formatDate(vaccine.expirationDate)} ${isExpired ? '(VENCIDA)' : '(Al día)'}`)
        }
        this.currentY += 5
      })

      this.addLine()
    }

    // Treatments
    if (options.tratamientos && patient.treatments && patient.treatments.length > 0) {
      this.addSubtitle('Registro de Tratamientos')

      patient.treatments.forEach((treatment, index) => {
        this.checkPageBreak(15)

        this.addText(`${index + 1}. ${treatment.name}`, true)
        this.addText(`Fecha de inicio: ${this.formatDate(treatment.startDate)}`)
        if (treatment.endDate) {
          const isActive = new Date(treatment.endDate) > new Date()
          this.addText(`Fecha de fin: ${this.formatDate(treatment.endDate)} ${isActive ? '(En curso)' : '(Finalizado)'}`)
        } else {
          this.addText('Estado: En curso')
        }
        this.currentY += 5
      })

      this.addLine()
    }

    // Footer
    this.checkPageBreak(15)
    this.currentY = this.pageHeight - 15
    this.doc.setFontSize(8)
    this.doc.setFont('helvetica', 'normal')
    this.doc.text(`Generado el ${new Date().toLocaleDateString('es-ES')} por PetLink`, this.margin, this.currentY)

    // Save the PDF
    this.doc.save(`${patient.name}_historial_${new Date().toISOString().split('T')[0]}.pdf`)
  }
}

export const pdfService = new PDFService()