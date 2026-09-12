import Vapi from '@vapi-ai/web';

export interface VapiCallbacks {
  onCallStart?: () => void;
  onCallEnd?: () => void;
  onTranscript?: (text: string) => void;
  /**
   * What the interviewer said. Needed when the assistant chooses the question
   * itself, since scoring an answer requires knowing what was asked.
   */
  onAssistantTranscript?: (text: string) => void;
  onError?: (error: Error) => void;
  onStatusUpdate?: (status: string) => void;
}

class VapiService {
  private vapi: Vapi | null = null;
  private isInitialized = false;
  private currentCallbacks: VapiCallbacks = {};

  constructor() {
    const publicKey = import.meta.env.VITE_VAPI_PUBLIC_KEY;
    if (publicKey) {
      this.vapi = new Vapi(publicKey);
      this.setupEventListeners();
      this.isInitialized = true;
    } else {
      console.warn('Vapi public key not found. Voice features disabled.');
    }
  }

  private setupEventListeners() {
    if (!this.vapi) return;

    // Call started
    this.vapi.on('call-start', () => {
      this.currentCallbacks.onCallStart?.();
      this.currentCallbacks.onStatusUpdate?.('Call connected...');
    });

    // Call ended
    this.vapi.on('call-end', () => {
      this.currentCallbacks.onCallEnd?.();
      this.currentCallbacks.onStatusUpdate?.('Call ended');
    });

    this.vapi.on('message', (message: any) => {
      if (message.type !== 'transcript') return;

      // Only final transcripts: Vapi also streams partials for the same
      // utterance, and appending those would repeat fragments of the answer.
      if (message.transcriptType && message.transcriptType !== 'final') return;

      if (message.role === 'user') {
        this.currentCallbacks.onTranscript?.(message.transcript);
      }

      if (message.role === 'assistant') {
        this.currentCallbacks.onAssistantTranscript?.(message.transcript);
      }
    });

    // Errors
    this.vapi.on('error', (error: Error) => {
      console.error('Vapi error:', error);
      this.currentCallbacks.onError?.(error);
    });
  }

  async startInterview(
    assistantId: string,
    question: string,
    params: any,
    callbacks: VapiCallbacks
  ): Promise<void> {
    if (!this.vapi || !this.isInitialized) {
      throw new Error('Vapi not initialized. Please check your API key.');
    }

    this.currentCallbacks = callbacks;

    try {
      this.currentCallbacks.onStatusUpdate?.('Starting call...');
      
      await this.vapi.start(assistantId, {
        variableValues: {
          ...params.variables,
          question: question,
        },
      });
      
      console.log('Interview started successfully');
    } catch (error) {
      console.error('Failed to start interview:', error);
      this.currentCallbacks.onError?.(error as Error);
      throw error;
    }
  }

  async stopInterview(): Promise<void> {
    if (this.vapi && this.isInitialized) {
      await this.vapi.stop();
    }
  }

  isVoiceSupported(): boolean {
    return !!this.vapi && this.isInitialized && 'mediaDevices' in navigator;
  }
}

export const vapiService = new VapiService();