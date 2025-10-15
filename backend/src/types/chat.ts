export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatRequest {
  message: string;
  conversationHistory?: ChatMessage[];
  userId?: string;
}

export interface ChatResponse {
  success: boolean;
  message?: ChatMessage;
  error?: string;
  conversationHistory?: ChatMessage[];
}

export interface QuickTipResponse {
  success: boolean;
  tip?: string;
  error?: string;
}

export interface MotivationResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface HealthCheckResponse {
  status: string;
  timestamp: string;
  uptime: number;
  environment: string;
}
