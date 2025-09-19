import { useState, useEffect, useCallback } from "react";
import {
  ConnectionState,
  getDeepgramService,
  type ConnectionEvent,
  type TranscriptionEvent,
} from "../services/deepgramService";

export interface UseSpeechToTextReturn {
  // Estados
  isListening: boolean;
  isConnecting: boolean;
  hasError: boolean;
  error: string | null;
  currentTranscript: string;
  finalText: string;

  // Acciones
  startListening: () => Promise<void>;
  stopListening: () => void;
  toggleListening: () => Promise<void>;
  clearText: () => void;
  addToFinalText: (text: string) => void;
}

export const useSpeechToText = (): UseSpeechToTextReturn => {
  // Estados locales
  const [isListening, setIsListening] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [finalText, setFinalText] = useState("");

  // Obtener service
  const deepgramService = getDeepgramService();

  // Manejar transcripción
  const handleTranscription = useCallback((event: TranscriptionEvent) => {
    if (event.isFinal) {
      // Transcripción final - agregar al texto final
      if (event.transcript.trim()) {
        setFinalText(
          (prev) => prev + (prev ? " " : "") + event.transcript.trim()
        );
        setCurrentTranscript(""); // Limpiar transcripción temporal
      }
    } else {
      // Transcripción temporal - actualizar transcript actual
      setCurrentTranscript(event.transcript);
    }
  }, []);

  // Manejar cambios de conexión
  const handleConnection = useCallback((event: ConnectionEvent) => {
    setIsConnecting(event.state === ConnectionState.CONNECTING);
    setIsListening(event.state === ConnectionState.CONNECTED);
    setHasError(event.state === ConnectionState.ERROR);

    if (event.error) {
      setError(event.error);
    } else if (event.state !== ConnectionState.ERROR) {
      setError(null);
    }
  }, []);

  // Configurar callbacks del service al montar
  useEffect(() => {
    deepgramService.onTranscription(handleTranscription);
    deepgramService.onConnection(handleConnection);

    // Limpiar al desmontar
    return () => {
      deepgramService.destroy();
    };
  }, [deepgramService, handleTranscription, handleConnection]);

  // Funciones de control
  const startListening = useCallback(async () => {
    try {
      await deepgramService.startListening();
    } catch (err) {
      console.error("[useSpeechToText] Error al iniciar escucha:", err);
    }
  }, [deepgramService]);

  const stopListening = useCallback(() => {
    deepgramService.stopListening();
    setCurrentTranscript(""); // Limpiar transcripción temporal al parar
  }, [deepgramService]);

  const toggleListening = useCallback(async () => {
    if (isListening) {
      stopListening();
    } else {
      await startListening();
    }
  }, [isListening, startListening, stopListening]);

  const clearText = useCallback(() => {
    setFinalText("");
    setCurrentTranscript("");
    setError(null);
  }, []);

  const addToFinalText = useCallback((text: string) => {
    if (text.trim()) {
      setFinalText((prev) => prev + (prev ? " " : "") + text.trim());
    }
  }, []);

  return {
    // Estados
    isListening,
    isConnecting,
    hasError,
    error,
    currentTranscript,
    finalText,

    // Acciones
    startListening,
    stopListening,
    toggleListening,
    clearText,
    addToFinalText,
  };
};
