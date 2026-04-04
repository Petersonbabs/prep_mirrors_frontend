import Vapi from '@vapi-ai/web';

export interface VapiCallbacks {
  onCallStart?: () => void;
  onCallEnd?: () => void;
  onTranscript?: (text: string) => void;
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

    // User transcript (what the user said)
    this.vapi.on('message', (message: any) => {
      console.log('Message:', message);
      
      if (message.type === 'transcript' && message.role === 'user') {
        const transcript = message.transcript;
        console.log('User said:', transcript);
        this.currentCallbacks.onTranscript?.(transcript);
      }
      
      if (message.type === 'transcript' && message.role === 'assistant') {
        console.log('Assistant said:', message.transcript);
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