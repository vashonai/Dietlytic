// Voice input service for speech recognition
import { Platform } from 'react-native';

export interface VoiceInputResult {
  text: string;
  confidence: number;
  isFinal: boolean;
}

export interface VoiceInputError {
  code: string;
  message: string;
}

export class VoiceInputService {
  private static instance: VoiceInputService;
  private isRecording: boolean = false;
  private recognition: any = null;

  static getInstance(): VoiceInputService {
    if (!VoiceInputService.instance) {
      VoiceInputService.instance = new VoiceInputService();
    }
    return VoiceInputService.instance;
  }

  constructor() {
    this.initializeRecognition();
  }

  private async initializeRecognition() {
    try {
      if (Platform.OS === 'web') {
        // Web Speech API
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
          const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
          this.recognition = new SpeechRecognition();
          
          this.recognition.continuous = false;
          this.recognition.interimResults = true;
          this.recognition.lang = 'en-US';
        }
      } else {
        // For React Native, we'll use a placeholder that can be replaced with actual speech recognition
        console.log('Voice recognition not yet implemented for React Native');
      }
    } catch (error) {
      console.error('Error initializing voice recognition:', error);
    }
  }

  /**
   * Start voice recording
   */
  async startRecording(): Promise<Promise<VoiceInputResult>> {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        reject({
          code: 'NOT_SUPPORTED',
          message: 'Voice recognition is not supported on this device'
        });
        return;
      }

      if (this.isRecording) {
        reject({
          code: 'ALREADY_RECORDING',
          message: 'Voice recording is already in progress'
        });
        return;
      }

      this.isRecording = true;

      this.recognition.onresult = (event: any) => {
        const result = event.results[event.results.length - 1];
        const transcript = result[0].transcript;
        const confidence = result[0].confidence;

        resolve({
          text: transcript,
          confidence: confidence || 0.8,
          isFinal: result.isFinal
        });
      };

      this.recognition.onerror = (event: any) => {
        this.isRecording = false;
        reject({
          code: event.error,
          message: this.getErrorMessage(event.error)
        });
      };

      this.recognition.onend = () => {
        this.isRecording = false;
      };

      this.recognition.start();
    });
  }

  /**
   * Stop voice recording
   */
  stopRecording(): void {
    if (this.recognition && this.isRecording) {
      this.recognition.stop();
      this.isRecording = false;
    }
  }

  /**
   * Check if voice recognition is available
   */
  isAvailable(): boolean {
    if (Platform.OS === 'web') {
      return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    }
    
    // For React Native, you would check for available speech recognition libraries
    return false; // Placeholder - implement based on your chosen RN speech library
  }

  /**
   * Check if currently recording
   */
  isCurrentlyRecording(): boolean {
    return this.isRecording;
  }

  /**
   * Get error message for speech recognition errors
   */
  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'no-speech':
        return 'No speech was detected. Please try again.';
      case 'audio-capture':
        return 'No microphone was found. Please ensure a microphone is connected.';
      case 'not-allowed':
        return 'Permission to use microphone was denied. Please enable microphone access.';
      case 'network':
        return 'Network error occurred. Please check your internet connection.';
      case 'aborted':
        return 'Voice recognition was aborted.';
      case 'language-not-supported':
        return 'Language not supported for voice recognition.';
      default:
        return 'An error occurred during voice recognition.';
    }
  }

  /**
   * Request microphone permissions
   */
  async requestPermissions(): Promise<boolean> {
    try {
      if (Platform.OS === 'web') {
        // Request microphone permission
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
        return true;
      } else {
        // For React Native, implement permission request based on your chosen library
        console.log('Permission request not yet implemented for React Native');
        return false;
      }
    } catch (error) {
      console.error('Error requesting microphone permissions:', error);
      return false;
    }
  }
}

export const voiceInputService = VoiceInputService.getInstance();
