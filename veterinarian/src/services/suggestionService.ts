interface Suggestion {
  id: string;
  type: 'patient_question' | 'doctor_reflection';
  text: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
}

interface MedicalSuggestionsRequest {
  transcription: string;
  conversationContext?: string;
}

interface MedicalSuggestionsResponse {
  suggestions: Suggestion[];
  generatedAt: string;
  transcriptionLength: number;
}

const sortSuggestionsByPriority = (suggestions: Suggestion[]): Suggestion[] => {
  const priorityOrder: Record<Suggestion['priority'], number> = {
    high: 1,
    medium: 2,
    low: 3,
  };
  return [...suggestions].sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority],
  );
};

export class SuggestionsService {
  private static readonly API_ENDPOINT = '/api/suggestions/questions';

  /**
   * Obtiene sugerencias médicas basadas en la transcripción
   * @param transcription - Texto de la transcripción médica
   * @param conversationContext - Contexto adicional de la conversación
   * @returns Promise con las sugerencias ordenadas por prioridad
   * @throws Error si la llamada a la API falla
   */
  static async fetchMedicalSuggestions(
    transcription: string,
    conversationContext?: string
  ): Promise<Suggestion[]> {
    
    // Validar entrada
    if (!transcription || !transcription.trim()) {
      console.log('[SuggestionsService] ⚠️ Transcripción vacía, devolviendo array vacío');
      return [];
    }

    console.log('[SuggestionsService] 📋 Solicitando sugerencias para transcripción de', transcription.length, 'caracteres');

    const requestPayload: MedicalSuggestionsRequest = {
      transcription: transcription.trim(),
      conversationContext: conversationContext?.trim()
    };

    try {
      const response = await fetch(this.API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error || `Error HTTP: ${response.status}`;
        console.error('[SuggestionsService] ❌ Error en la API de sugerencias:', errorMessage);
        throw new Error(errorMessage);
      }

      const data: MedicalSuggestionsResponse = await response.json();
      
      // Procesar y ordenar sugerencias si existen
      if (data.suggestions && data.suggestions.length > 0) {
        const sortedSuggestions = sortSuggestionsByPriority(data.suggestions);
        console.log('[SuggestionsService] ✅ Sugerencias obtenidas y ordenadas exitosamente:', sortedSuggestions.length);
        return sortedSuggestions;
      } else {
        console.log('[SuggestionsService] ℹ️ No se generaron sugerencias para esta transcripción');
        return [];
      }

    } catch (error) {
      console.error('[SuggestionsService] ❌ Error obteniendo sugerencias:', error);
      
      // Re-lanzar el error con contexto adicional
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      throw new Error(`Error al obtener sugerencias médicas: ${errorMessage}`);
    }
  }

  /**
   * Verifica si el servicio de sugerencias está disponible
   * @returns Promise que resuelve true si el servicio está disponible
   */
  static async isServiceAvailable(): Promise<boolean> {
    try {
      const response = await fetch(this.API_ENDPOINT, {
        method: 'GET',
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

export type { Suggestion, MedicalSuggestionsRequest, MedicalSuggestionsResponse };