import { MedicalIcons } from '../MedicalIcons';
import type { Suggestion } from '../../../types/suggestions';

interface QuestionSuggestionsProps {
  suggestions: Suggestion[];
  isLoading: boolean;
  error: string | null;
  transcription?: string;
  onSuggestionClick?: (suggestion: Suggestion) => void;
  onRetry?: () => void;
}

export default function QuestionSuggestions({
  suggestions,
  isLoading,
  error,
  transcription,
  onSuggestionClick,
  onRetry
}: QuestionSuggestionsProps) {
  const handleSuggestionClick = (suggestion: Suggestion) => {
    console.log('[QuestionSuggestions] 💡 Sugerencia de pregunta seleccionada:', suggestion);
    if (onSuggestionClick) {
      onSuggestionClick(suggestion);
    }
  };

  if (error) {
    return (
      <div className="form__error" style={{ marginBottom: '16px', padding: '12px', borderRadius: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <div style={{
            padding: '4px',
            backgroundColor: '#fee2e2',
            borderRadius: '6px',
            flexShrink: 0
          }}>
            <svg style={{ width: '16px', height: '16px', color: '#b91c1c' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '14px', fontWeight: 500, color: '#b91c1c', marginBottom: '4px' }}>
              Error al generar preguntas
            </p>
            <p style={{ fontSize: '12px', color: '#b91c1c', marginBottom: '12px' }}>
              {error}
            </p>
            <button
              onClick={onRetry}
              className="btn btn--ghost"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                padding: '6px 12px'
              }}
            >
              <MedicalIcons.Refresh size={12} />
              <span>Reintentar</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (suggestions.length > 0) {
    return (
      <div style={{ display: 'grid', gap: '12px' }}>
        {suggestions.map((suggestion) => (
          <div
            key={suggestion.id}
            style={{
              padding: '16px',
              backgroundColor: '#fff',
              border: `1px solid var(--border)`,
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}
            className="suggestion-card"
            onClick={() => handleSuggestionClick(suggestion)}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--brand-600)';
              e.currentTarget.style.boxShadow = '0 0 0 2px color-mix(in oklab, var(--brand-600) 20%, white)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{
                padding: '8px',
                backgroundColor: 'var(--brand-50)',
                borderRadius: '8px',
                flexShrink: 0,
                marginTop: '2px'
              }}>
                <MedicalIcons.MedicalQuestion size={16} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontSize: '14px',
                  color: 'var(--text)',
                  lineHeight: '1.5',
                  fontWeight: 500,
                  margin: 0
                }}>
                  {suggestion.text}
                </p>
                <div style={{
                  marginTop: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Estado sin transcripción
  if (!transcription?.trim() && !isLoading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        textAlign: 'center',
        color: 'var(--muted)'
      }}>
        <div style={{
          padding: '16px',
          backgroundColor: 'var(--bg)',
          borderRadius: '50%',
          marginBottom: '16px'
        }}>
          <MedicalIcons.MedicalMicrophone size={32} />
        </div>
        
        <p style={{ fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>Esperando transcripción</p>
        <p style={{ fontSize: '12px', maxWidth: '280px' }}>
          Inicie la grabación para obtener preguntas inteligentes basadas en el contexto médico
        </p>
      </div>
    );
  }

  // Estado de carga
  if (isLoading && suggestions.length === 0 && transcription?.trim()) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        textAlign: 'center',
        color: 'var(--muted)'
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          border: '3px solid var(--border)',
          borderTop: '3px solid var(--brand-600)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '16px'
        }}></div>
        <p style={{ fontSize: '14px', fontWeight: 500, marginBottom: '4px' }}>Generando preguntas inteligentes</p>
        <p style={{ fontSize: '12px' }}>Analizando contexto médico...</p>
      </div>
    );
  }

  // Estado sin sugerencias
  if (!isLoading && suggestions.length === 0 && transcription?.trim()) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        textAlign: 'center',
        color: 'var(--muted)'
      }}>
        <div style={{
          padding: '16px',
          backgroundColor: 'var(--bg)',
          borderRadius: '50%',
          marginBottom: '16px'
        }}>
          <MedicalIcons.MedicalSuggestions size={32} />
        </div>
        <p style={{ fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>No hay preguntas disponibles</p>
        <p style={{ fontSize: '12px', marginBottom: '16px', maxWidth: '280px' }}>
          No se pudieron generar preguntas para la transcripción actual
        </p>
        <button
          onClick={onRetry}
          className="btn btn--ghost"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px'
          }}
        >
          <MedicalIcons.Refresh size={14} />
          <span>Intentar de nuevo</span>
        </button>
      </div>
    );
  }

  return null;
}
