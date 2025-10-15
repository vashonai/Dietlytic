import { ChatMessage } from './chatbotService';

// Backend API configuration
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface BackendChatRequest {
  message: string;
  conversationHistory?: ChatMessage[];
  userId?: string;
}

export interface BackendChatResponse {
  success: boolean;
  message?: ChatMessage;
  error?: string;
  conversationHistory?: ChatMessage[];
}

export interface BackendQuickTipResponse {
  success: boolean;
  tip?: string;
  error?: string;
}

export interface BackendMotivationResponse {
  success: boolean;
  message?: string;
  error?: string;
}

class BackendApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  /**
   * Send a message to the fitness coach via backend API
   */
  async sendMessage(
    message: string, 
    conversationHistory: ChatMessage[] = []
  ): Promise<BackendChatResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          conversationHistory,
        } as BackendChatRequest),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data as BackendChatResponse;

    } catch (error) {
      console.error('Backend API error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send message'
      };
    }
  }

  /**
   * Get a quick fitness tip from backend API
   */
  async getQuickFitnessTips(): Promise<BackendQuickTipResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/quick-tip`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data as BackendQuickTipResponse;

    } catch (error) {
      console.error('Backend API error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get fitness tip'
      };
    }
  }

  /**
   * Get a motivational message from backend API
   */
  async getMotivationalMessage(): Promise<BackendMotivationResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/motivation`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data as BackendMotivationResponse;

    } catch (error) {
      console.error('Backend API error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get motivational message'
      };
    }
  }

  /**
   * Clear conversation history via backend API
   */
  async clearConversation(): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/clear`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;

    } catch (error) {
      console.error('Backend API error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to clear conversation'
      };
    }
  }

  /**
   * Check if backend API is available
   */
  async healthCheck(): Promise<{ status: string; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl.replace('/api', '')}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { status: data.status };

    } catch (error) {
      console.error('Backend health check error:', error);
      return {
        status: 'error',
        error: error instanceof Error ? error.message : 'Backend API unavailable'
      };
    }
  }
}

// Export singleton instance
export const backendApiService = new BackendApiService();
