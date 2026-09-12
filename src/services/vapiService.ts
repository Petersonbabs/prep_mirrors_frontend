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

  /**
   * Injects a system message into a live call.
   *
   * The model has no clock, so anything time-dependent has to be told to it.
   * A message added this way is only acted on at the assistant's next turn,
   * which is what keeps a wrap-up instruction from cutting the candidate off
   * mid-answer.
   */
  sendSystemMessage(content: string): void {
    if (!this.vapi || !this.isInitialized) return;

    try {
      this.vapi.send({
        type: 'add-message',
        message: { role: 'system', content },
      });
    } catch (error) {
      // Never surface this: a dropped time cue degrades the wrap-up, but the
      // call itself is still fine and the hard duration cap still applies.
      console.warn('Failed to send system message to assistant:', error);
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