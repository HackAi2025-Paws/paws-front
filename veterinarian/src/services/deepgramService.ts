import { createClient, LiveTranscriptionEvents } from "@deepgram/sdk";
import { apiClient } from "./apiClient";

export type DeepgramAuthResponse = {
    accessToken: string;
    expiresIn: string;
}

// Estados de conexión
export enum ConnectionState {
  DISCONNECTED = "disconnected",
  CONNECTING = "connecting",
  CONNECTED = "connected",
  ERROR = "error",
}

// Tipos de eventos
export interface TranscriptionEvent {
  transcript: string;
  isFinal: boolean;
}

export interface ConnectionEvent {
  state: ConnectionState;
  error?: string;
}

// Tipo para la conexión de Deepgram
interface DeepgramConnection {
  on(event: string, callback: (...args: unknown[]) => void): void;
  getReadyState(): number;
  send(data: Blob): void;
  finish(): void;
}

// Service principal de Deepgram
export class DeepgramService {
  private connection: DeepgramConnection | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private mediaStream: MediaStream | null = null;
  private connectionState: ConnectionState = ConnectionState.DISCONNECTED;

  // Callbacks
  private onTranscriptionCallback?: (event: TranscriptionEvent) => void;
  private onConnectionCallback?: (event: ConnectionEvent) => void;

  // Configurar callbacks
  onTranscription(callback: (event: TranscriptionEvent) => void) {
    this.onTranscriptionCallback = callback;
  }

  onConnection(callback: (event: ConnectionEvent) => void) {
    this.onConnectionCallback = callback;
  }

  // Obtener token de acceso
    private async getAccessToken(): Promise<string> {
    // esto es lo que hay que cambiar porque a alguien se le ocurrio usar vite en vez de next (ana)
    const response = await apiClient.post<DeepgramAuthResponse>("/transcription/auth");
    const data = response.data;

    if (!response.success || response.error) {
      throw new Error(response.error || "Failed to get access token");
    }

    return data!.accessToken;
  }

  // Configurar micrófono
  private async setupMicrophone(): Promise<MediaStream> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaStream = stream;

      console.log("[DeepgramService] 🎤 Micrófono configurado:", {
        streamId: stream.id,
        audioTracks: stream.getAudioTracks().length,
        trackStates: stream.getAudioTracks().map((track) => ({
          label: track.label,
          enabled: track.enabled,
          readyState: track.readyState,
        })),
      });

      return stream;
    } catch (error) {
      console.error(
        "[DeepgramService] ❌ Error accediendo al micrófono:",
        error
      );
      throw new Error(
        "No se pudo acceder al micrófono. Por favor, permite el acceso."
      );
    }
  }

  // Conectar con Deepgram
  private async connectToDeepgram(): Promise<DeepgramConnection> {
    const accessToken = await this.getAccessToken();
    const deepgram = createClient({ accessToken });

    const connection = deepgram.listen.live({
      model: "nova-3",
      language: "es",
      smart_format: true,
      interim_results: true,
    });

    return connection as DeepgramConnection;
  }

  // Configurar eventos de conexión
  private setupConnectionEvents(connection: DeepgramConnection) {
    connection.on(LiveTranscriptionEvents.Open, () => {
      console.log("[DeepgramService] ✅ Conectado a Deepgram");
      this.connectionState = ConnectionState.CONNECTED;
      this.onConnectionCallback?.({
        state: ConnectionState.CONNECTED,
      });

      // Ahora que estamos conectados, iniciar el MediaRecorder
      if (this.mediaRecorder && this.mediaRecorder.state === "inactive") {
        console.log("[DeepgramService] 🎙️ Iniciando grabación de audio...");
        this.mediaRecorder.start(100); // Enviar datos cada 100ms
      }
    });

    connection.on(LiveTranscriptionEvents.Transcript, (data: unknown) => {
      console.log(
        "[DeepgramService] 📝 Datos de transcripción recibidos:",
        data
      );
      const transcript = (
        data as { channel?: { alternatives?: { transcript?: string }[] } }
      )?.channel?.alternatives?.[0]?.transcript;
      if (transcript) {
        console.log(
          "[DeepgramService] 📝 Transcripción:",
          transcript,
          "Final:",
          (data as { is_final: boolean }).is_final
        );
        this.onTranscriptionCallback?.({
          transcript,
          isFinal: (data as { is_final: boolean }).is_final,
        });
      } else {
        console.log(
          "[DeepgramService] 📝 Transcripción vacía o sin datos válidos"
        );
      }
    });

    connection.on(LiveTranscriptionEvents.Error, (error: unknown) => {
      console.error("[DeepgramService] Error en Deepgram:", error);
      this.connectionState = ConnectionState.ERROR;
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error en el reconocimiento de voz";
      this.onConnectionCallback?.({
        state: ConnectionState.ERROR,
        error: errorMessage,
      });
    });

    connection.on(LiveTranscriptionEvents.Close, (event: unknown) => {
      console.log("[DeepgramService] 🔌 Conexión cerrada. Evento:", event);
      console.log(
        "[DeepgramService] 🔌 Estado del MediaRecorder:",
        this.mediaRecorder?.state
      );
      console.log(
        "[DeepgramService] 🔌 ¿MediaRecorder existe?",
        !!this.mediaRecorder
      );
      this.connectionState = ConnectionState.DISCONNECTED;
      this.onConnectionCallback?.({
        state: ConnectionState.DISCONNECTED,
      });
    });
  }

  // Configurar MediaRecorder
  private setupMediaRecorder(stream: MediaStream) {
    // Verificar formatos soportados
    const mimeTypes = ["audio/webm", "audio/webm;codecs=opus", "audio/wav"];
    let selectedMimeType = "audio/webm"; // default

    for (const mimeType of mimeTypes) {
      if (MediaRecorder.isTypeSupported(mimeType)) {
        selectedMimeType = mimeType;
        console.log("[DeepgramService] 🎵 Usando formato de audio:", mimeType);
        break;
      }
    }

    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: selectedMimeType,
    });
    this.mediaRecorder = mediaRecorder;

    console.log("[DeepgramService] 🎙️ MediaRecorder configurado con:", {
      mimeType: selectedMimeType,
      state: mediaRecorder.state,
    });

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0 && this.connection?.getReadyState() === 1) {
        console.log(
          "[DeepgramService] 🎵 Enviando datos de audio:",
          event.data.size,
          "bytes"
        );
        this.connection.send(event.data);
      } else {
        console.warn("[DeepgramService] ⚠️ No se puede enviar audio:", {
          dataSize: event.data.size,
          connectionState: this.connection?.getReadyState(),
          connectionExists: !!this.connection,
        });
      }
    };

    return mediaRecorder;
  }

  // Iniciar escucha
  async startListening(): Promise<void> {
    if (
      this.connectionState === ConnectionState.CONNECTING ||
      this.connectionState === ConnectionState.CONNECTED
    ) {
      return;
    }

    try {
      this.connectionState = ConnectionState.CONNECTING;
      this.onConnectionCallback?.({
        state: ConnectionState.CONNECTING,
      });

      // 1. Configurar micrófono
      const stream = await this.setupMicrophone();

      // 2. Conectar con Deepgram
      this.connection = await this.connectToDeepgram();

      // 3. Configurar MediaRecorder (pero NO iniciar aún)
      this.setupMediaRecorder(stream);

      // 4. Configurar eventos (esto iniciará el MediaRecorder cuando esté conectado)
      this.setupConnectionEvents(this.connection);
    } catch (error) {
      this.connectionState = ConnectionState.ERROR;
      const message =
        error instanceof Error ? error.message : "Error al iniciar la escucha";
      this.onConnectionCallback?.({
        state: ConnectionState.ERROR,
        error: message,
      });
      this.cleanup();
    }
  }

  // Parar escucha
  stopListening(): void {
    this.cleanup();
    this.connectionState = ConnectionState.DISCONNECTED;
    this.onConnectionCallback?.({
      state: ConnectionState.DISCONNECTED,
    });
  }

  // Limpiar recursos
  private cleanup(): void {
    // Parar MediaRecorder
    if (this.mediaRecorder && this.mediaRecorder.state !== "inactive") {
      this.mediaRecorder.stop();
    }

    // Cerrar conexión de Deepgram
    if (this.connection) {
      this.connection.finish();
      this.connection = null;
    }

    // Parar stream de audio
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }

    this.mediaRecorder = null;
  }

  // Obtener estado actual
  getConnectionState(): ConnectionState {
    return this.connectionState;
  }

  // Verificar si está escuchando
  isListening(): boolean {
    return this.connectionState === ConnectionState.CONNECTED;
  }

  // Verificar si está conectando
  isConnecting(): boolean {
    return this.connectionState === ConnectionState.CONNECTING;
  }

  // Verificar si hay error
  hasError(): boolean {
    return this.connectionState === ConnectionState.ERROR;
  }

  // Limpiar al destruir
  destroy(): void {
    this.cleanup();
    this.onTranscriptionCallback = undefined;
    this.onConnectionCallback = undefined;
  }
}

// Instancia singleton
let deepgramService: DeepgramService | null = null;

export const getDeepgramService = (): DeepgramService => {
  if (!deepgramService) {
    deepgramService = new DeepgramService();
  }
  return deepgramService;
};
