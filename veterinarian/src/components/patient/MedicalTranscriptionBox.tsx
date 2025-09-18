'use client';

import { useState, useEffect } from 'react';

// Simple inline icons to replace lucide-react dependencies
const Loader2 = ({ style, size = 24 }: { style?: React.CSSProperties; size?: number }) => (
  <svg width={size} height={size} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2L12 6M12 18L12 22M4.22 4.22L7.05 7.05M16.95 16.95L19.78 19.78M2 12L6 12M18 12L22 12M4.22 19.78L7.05 16.95M16.95 7.05L19.78 4.22" />
  </svg>
);

const ChevronDown = ({ style, size = 24 }: { style?: React.CSSProperties; size?: number }) => (
  <svg width={size} height={size} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 9L12 15L18 9" />
  </svg>
);

const ChevronUp = ({ style, size = 24 }: { style?: React.CSSProperties; size?: number }) => (
  <svg width={size} height={size} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 15L12 9L6 15" />
  </svg>
);

const MedicalAI = ({ size = 24, style }: { size?: number; style?: React.CSSProperties }) => (
  <svg width={size} height={size} style={style} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-13h2v6h-2v-6zm0 8h2v2h-2v-2z"/>
  </svg>
);

const Medications = ({ size = 24, style }: { size?: number; style?: React.CSSProperties }) => (
  <svg width={size} height={size} style={style} fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.5 11.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5zM6 6v12h12V6H6zm10 10H8V8h8v8z"/>
    <path d="M19.5 3.09L15.09 7.5L13 5.41L9.59 8.82L11 10.23L13 8.23L15.09 10.32L20.91 4.5L19.5 3.09z"/>
  </svg>
);

// Simple types for medications (replacing external dependency)
interface IdentifiedMedication {
  id: string;
  name: string;
  dosage?: string;
  frequency?: string;
  confirmed?: boolean;
}

interface MedicalTranscriptionResponse {
  original: string;
  corrected: string;
  medications?: IdentifiedMedication[];
  processedAt: string;
  model: string;
  tokensUsed: number;
}

interface MedicationConfirmationEvent {
  medicationId: string;
  confirmed: boolean;
}

// Simple replacements for missing components
const HighlightedMedicalText = ({ text }: { text: string; medications: IdentifiedMedication[] }) => (
  <div style={{ whiteSpace: 'pre-wrap' }}>{text}</div>
);

const MedicationsList = ({ medications }: { medications: IdentifiedMedication[]; onMedicationConfirm: (event: MedicationConfirmationEvent) => void }) => (
  <div style={{ padding: '16px', backgroundColor: 'var(--bg)', borderRadius: '8px', border: '1px solid var(--border)' }}>
    <h4 style={{ margin: '0 0 12px 0', color: 'var(--text)' }}>Medicamentos identificados:</h4>
    {medications.map(med => (
      <div key={med.id} style={{ marginBottom: '8px', padding: '8px', backgroundColor: 'white', borderRadius: '6px' }}>
        <div style={{ fontWeight: 600, color: 'var(--brand-600)' }}>{med.name}</div>
        {med.dosage && <div style={{ fontSize: '14px', color: 'var(--muted)' }}>Dosis: {med.dosage}</div>}
        {med.frequency && <div style={{ fontSize: '14px', color: 'var(--muted)' }}>Frecuencia: {med.frequency}</div>}
      </div>
    ))}
  </div>
);

interface MedicalTranscriptionBoxProps {
  transcription: string;
  shouldProcess: boolean;
  onProcessed?: (processedText: string) => void;
  onError?: (error: string) => void;
}

export default function MedicalTranscriptionBox({ 
  transcription, 
  shouldProcess, 
  onProcessed,
  onError 
}: MedicalTranscriptionBoxProps) {
  const [medicalResponse, setMedicalResponse] = useState<MedicalTranscriptionResponse | null>(null);
  const [medications, setMedications] = useState<IdentifiedMedication[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [lastProcessedAt, setLastProcessedAt] = useState<Date | null>(null);
  const [showMedicationsList, setShowMedicationsList] = useState<boolean>(true);

  // Función para manejar confirmación de medicamentos
  const handleMedicationConfirm = (event: MedicationConfirmationEvent) => {
    setMedications(prevMeds => 
      prevMeds.map(med => 
        med.id === event.medicationId 
          ? { ...med, confirmed: event.confirmed }
          : med
      )
    );
  };

  // Función para procesar transcripción médica con IA
  const processMedicalTranscription = async (textToProcess: string) => {
    if (!textToProcess.trim()) return;

    setIsProcessing(true);
    console.log('[MedicalTranscriptionBox] Procesando transcripción médica:', textToProcess);

    try {
      const response = await fetch('/api/transcription/medical', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcription: textToProcess
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error HTTP: ${response.status}`);
      }

      const data: MedicalTranscriptionResponse = await response.json();
      
      setMedicalResponse(data);
      setMedications(data.medications || []);
      setLastProcessedAt(new Date());
      setIsProcessing(false);

      // Mostrar automáticamente la lista de medicamentos si hay alguno
      if (data.medications && data.medications.length > 0) {
        setShowMedicationsList(true);
      }

      // Devolver el texto procesado al componente padre
      onProcessed?.(data.corrected || textToProcess);
      
    } catch (error) {
      console.error('[MedicalTranscriptionBox] Error procesando transcripción médica:', error);
      
      const errorMessage = `❌ ERROR AL PROCESAR:\n\n${error instanceof Error ? error.message : 'Error desconocido'}\n\nVerifica que esté configurado OPENAI_API_KEY en las variables de entorno.`;
      
      // Crear un response de error
      setMedicalResponse({
        original: textToProcess,
        corrected: errorMessage,
        medications: [],
        processedAt: new Date().toISOString(),
        model: 'error',
        tokensUsed: 0
      });
      setMedications([]);
      setIsProcessing(false);

      onError?.(error instanceof Error ? error.message : 'Error desconocido');
      // En caso de error, no se devuelve texto procesado
    }
  };

  // Efecto para procesar cuando shouldProcess cambia a true
  useEffect(() => {
    if (shouldProcess && transcription.trim()) {
      processMedicalTranscription(transcription);
    }
  }, [shouldProcess, transcription]);

  const clearContent = () => {
    setMedicalResponse(null);
    setMedications([]);
    setLastProcessedAt(null);
  };

  useEffect(() => {
    if (!transcription) {
      clearContent();
    }
  }, [transcription]);

  return (
    <div style={{
      padding: '16px', // Better padding for container
      backgroundColor: 'transparent', // Make container invisible
      border: 'none', // Remove border
      borderRadius: '14px',
      marginBottom: '8px', // Reduced from 16px to 8px
      boxShadow: 'none' // Remove shadow
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}> {/* Reduced from 24px to 16px */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            padding: '8px',
            backgroundColor: 'var(--brand-600)',
            borderRadius: '8px'
          }}>
            <MedicalAI size={24} style={{ color: 'white' }} />
          </div>
          <div>
            <h2 style={{
              fontSize: '18px',
              fontWeight: 700,
              color: 'var(--text)',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              Corrección Médica IA
              {isProcessing && (
                <Loader2 style={{ width: '20px', height: '20px', animation: 'spin 1s linear infinite', color: 'var(--brand-600)' }} />
              )}
            </h2>
            <p style={{
              fontSize: '14px',
              color: 'var(--brand-700)',
              fontWeight: 500,
              margin: 0
            }}>
              Optimización automática de terminología médica
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {medications.length > 0 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'var(--bg)',
              borderRadius: '8px',
              padding: '8px 12px',
              border: '1px solid var(--border)'
            }}>
              <div style={{
                padding: '4px',
                backgroundColor: 'var(--brand-50)',
                borderRadius: '4px'
              }}>
                <Medications size={16} style={{ color: 'var(--brand-700)' }} />
              </div>
              <div>
                <p style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  margin: 0
                }}>
                  Medicamentos
                </p>
                <p style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: 'var(--brand-700)',
                  margin: 0
                }}>
                  {medications.length}
                </p>
              </div>
            </div>
          )}

          <div style={{ textAlign: 'right' }}>
            <div style={{
              fontSize: '12px',
              color: 'var(--muted)',
              marginBottom: '4px'
            }}>
              Procesamiento automático
            </div>
            {lastProcessedAt && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '12px',
                color: 'var(--brand-700)'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: 'var(--brand-600)',
                  borderRadius: '50%'
                }}></div>
                <span>{lastProcessedAt.toLocaleTimeString()}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Caja de transcripción médica con medicamentos resaltados */}
      <div style={{ position: 'relative' }}>
        <div style={{
          width: '100%',
          minHeight: 'auto', // Auto height to fit content
          padding: '16px', // Keep good padding for readability
          fontSize: '15px',
          lineHeight: '1.6',
          borderRadius: '12px',
          border: '1px solid var(--border)',
          backgroundColor: isProcessing ? 'var(--brand-50)' : 'var(--bg)' // Light background for content area
        }}>
          {isProcessing ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '60px', // Minimal height for loading state
              color: 'var(--muted)'
            }}>
              <Loader2 style={{ width: '24px', height: '24px', animation: 'spin 1s linear infinite', marginRight: '8px' }} />
              Procesando con IA médica especializada...
            </div>
          ) : medicalResponse ? (
            medicalResponse.corrected.startsWith('❌') ? (
              <div style={{
                color: '#b91c1c',
                whiteSpace: 'pre-wrap'
              }}>
                {medicalResponse.corrected}
              </div>
            ) : (
              <HighlightedMedicalText
                text={medicalResponse.corrected}
                medications={medications}
              />
            )
          ) : (
            <div style={{
              color: 'var(--muted)',
              minHeight: '60px', // Minimal height for placeholder text
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center'
            }}>
              La IA médica procesará y corregirá la transcripción con terminología médica apropiada...
            </div>
          )}
        </div>
        {/* Indicador de procesamiento */}
        {isProcessing && (
          <div style={{
            position: 'absolute',
            bottom: '8px',
            right: '8px',
            backgroundColor: 'var(--brand-600)',
            color: 'white',
            fontSize: '12px',
            padding: '4px 8px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <Loader2 style={{ width: '12px', height: '12px', animation: 'spin 1s linear infinite' }} />
            Procesando IA
          </div>
        )}

        {/* Indicador de texto procesado */}
        {medicalResponse && !isProcessing && !medicalResponse.corrected.startsWith('❌') && (
          <div style={{
            position: 'absolute',
            bottom: '12px',
            right: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            backgroundColor: 'var(--brand-600)',
            color: 'white',
            fontSize: '12px',
            padding: '6px 12px',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <svg style={{ width: '12px', height: '12px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span style={{ fontWeight: 500 }}>Procesado</span>
          </div>
        )}

        {/* Indicador de error */}
        {medicalResponse && medicalResponse.corrected.startsWith('❌') && (
          <div style={{
            position: 'absolute',
            bottom: '12px',
            right: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            backgroundColor: '#ef4444',
            color: 'white',
            fontSize: '12px',
            padding: '6px 12px',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <svg style={{ width: '12px', height: '12px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span style={{ fontWeight: 500 }}>Error</span>
          </div>
        )}
      </div>

      {/* Lista de medicamentos identificados */}
      {medications.length > 0 && (
        <div style={{ marginTop: '16px' }}> {/* Reduced from 24px to 16px */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}> {/* Reduced from 16px to 12px */}
            <button
              onClick={() => setShowMedicationsList(!showMedicationsList)}
              style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '18px',
                fontWeight: 600,
                color: 'var(--text)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--brand-600)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text)'}
            >
              {showMedicationsList ? (
                <ChevronUp style={{ width: '20px', height: '20px', marginRight: '8px' }} />
              ) : (
                <ChevronDown style={{ width: '20px', height: '20px', marginRight: '8px' }} />
              )}
              Medicamentos Identificados
            </button>
          </div>

          {showMedicationsList && (
            <MedicationsList
              medications={medications}
              onMedicationConfirm={handleMedicationConfirm}
            />
          )}
        </div>
      )}
    </div>
  );
}
