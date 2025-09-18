import {useState, useEffect, useCallback} from 'react';
import { MedicalIcons } from '../MedicalIcons';
import QuestionSuggestions from './QuestionSuggestions';
import type { Suggestion } from '../../../types/suggestions';

interface SuggestionsPanelProps {
  transcription: string;
  conversationContext?: string;
  onSuggestionClick?: (suggestion: Suggestion) => void;
  onManualRefresh?: () => void;
  className?: string;
}

export default function SuggestionsPanel({
  transcription,
  conversationContext,
  onSuggestionClick,
  onManualRefresh,
  className = ""
}: SuggestionsPanelProps) {
  // Estados para sugerencias de preguntas
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const clearAllData = useCallback(() => {
    console.log('[SuggestionsPanel] 🧹 Limpiando sugerencias');
    setSuggestions([]);
    setError(null);
    setLastUpdated(null);
    setIsLoading(false);
  }, []);

  const fetchSuggestions = useCallback(async () => {
    console.log('[SuggestionsPanel] 🔄 Generando sugerencias de preguntas...');
    if (!transcription || !transcription.trim()) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Mock suggestions - esto se reemplazará con el servicio real
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simular delay

      const mockSuggestions: Suggestion[] = [
        {
          id: '1',
          text: '¿Desde cuándo presenta estos síntomas?',
          category: 'Historia',
          priority: 'high'
        },
        {
          id: '2',
          text: '¿Ha tenido episodios similares anteriormente?',
          category: 'Antecedentes',
          priority: 'medium'
        },
        {
          id: '3',
          text: '¿Hay algún factor desencadenante que haya notado?',
          category: 'Contextual',
          priority: 'medium'
        }
      ];

      setSuggestions(mockSuggestions);
      setLastUpdated(new Date());

    } catch (err) {
      console.error('[SuggestionsPanel] ❌ Error obteniendo sugerencias:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  }, [transcription, conversationContext]);

  const fetchAllData = useCallback(async () => {
    console.log('[SuggestionsPanel] 🔄 Iniciando fetch de sugerencias...');
    await fetchSuggestions();
  }, [fetchSuggestions]);

  const handleManualRefresh = () => {
    console.log('[SuggestionsPanel] 👤 Usuario solicitó refresh manual de todas las sugerencias');
    fetchAllData();
    if (onManualRefresh) {
      onManualRefresh();
    }
  };

  useEffect(() => {
    console.log('[SuggestionsPanel] 🔄 Props cambiaron, verificando si necesita generar sugerencias... \n', transcription);
    if (transcription && transcription.trim()) {
      console.log('[SuggestionsPanel] 🔄 Transcription Sí cambió, generando todas las sugerencias...');
      fetchAllData();
    } else {
      console.log('[SuggestionsPanel] 🔄 Transcription No cambió, limpiando datos...');
      clearAllData();
    }
  }, [transcription, clearAllData, fetchAllData]);

  const handleSuggestionClick = (suggestion: Suggestion) => {
    console.log('[SuggestionsPanel] 💡 Delegando click de sugerencia a parent');
    if (onSuggestionClick) {
      onSuggestionClick(suggestion);
    }
  };

  return (
    <div style={{
      backgroundColor: '#fff',
      border: '1px solid var(--border)',
      borderRadius: '14px',
      overflow: 'hidden'
    }} className={className}>
      {/* Header */}
      <div style={{
        padding: '20px',
        borderBottom: '1px solid var(--border)',
        background: 'color-mix(in oklab, var(--brand-50) 60%, #ffffff)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              padding: '8px',
              backgroundColor: 'var(--brand-600)',
              borderRadius: '8px'
            }}>
              <MedicalIcons.MedicalSuggestions size={20} style={{ color: 'white' }} />
            </div>
            <div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 700,
                color: 'var(--text)',
                margin: 0,
                marginBottom: '4px'
              }}>
                Preguntas Inteligentes
              </h3>
              <p style={{
                fontSize: '12px',
                color: 'var(--brand-700)',
                fontWeight: 500,
                margin: 0
              }}>
                Sugerencias contextuales para la consulta
              </p>
            </div>
          </div>

          <button
            onClick={handleManualRefresh}
            disabled={isLoading || !transcription?.trim()}
            className="btn btn--ghost"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              padding: '8px 12px'
            }}
            title="Actualizar sugerencias"
          >
            <MedicalIcons.Refresh
              size={14}
              style={{
                animation: isLoading ? 'spin 1s linear infinite' : 'none'
              }}
            />
            <span>Actualizar</span>
          </button>
        </div>

        {/* Info de estado */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {lastUpdated && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#10b981',
                  borderRadius: '50%'
                }}></div>
                <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
                  {lastUpdated.toLocaleTimeString()}
                </span>
              </div>
            )}
            {suggestions.length > 0 && (
              <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
                {suggestions.length} pregunta{suggestions.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {isLoading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--brand-600)' }}>
              <div style={{
                width: '12px',
                height: '12px',
                border: '2px solid currentColor',
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              <span style={{ fontSize: '12px', fontWeight: 500 }}>Generando...</span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '16px' }}>
        <QuestionSuggestions
          suggestions={suggestions}
          isLoading={isLoading}
          error={error}
          transcription={transcription}
          onSuggestionClick={handleSuggestionClick}
          onRetry={handleManualRefresh}
        />
      </div>
    </div>
  );
}
