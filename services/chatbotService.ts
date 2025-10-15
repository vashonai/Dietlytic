import { config, validateEnvironment } from '@/config/environment';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: config.openai.apiKey,
});

// Fitness coach system prompt
const FITNESS_COACH_SYSTEM_PROMPT = `You are a professional fitness coach and nutritionist with expertise in helping people achieve their health and fitness goals. You specialize in:

- Weight management and body composition
- Nutrition planning and meal recommendations
- Exercise routines and workout plans
- Motivation and habit building
- Health monitoring and progress tracking

You provide personalized, practical, and encouraging advice. Always consider the user's current fitness level, dietary preferences, and health conditions when giving recommendations.

Key guidelines:
- Be supportive and motivating
- Provide specific, actionable advice
- Ask clarifying questions when needed
- Focus on sustainable lifestyle changes
- Consider Jamaican dietary preferences and local foods
- Be culturally sensitive and inclusive
- Keep responses concise but informative
- Always recommend consulting healthcare professionals for medical concerns

Respond in a friendly, professional tone that makes users feel supported on their fitness journey.`;

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatbotResponse {
  message: ChatMessage;
  success: boolean;
  error?: string;
}

export class FitnessCoachChatbot {
  private conversationHistory: ChatMessage[] = [];

  constructor() {
    // Validate environment on initialization
    validateEnvironment();
  }

  /**
   * Send a message to the fitness coach chatbot
   */
  async sendMessage(userMessage: string): Promise<ChatbotResponse> {
    try {
      // Validate API key
      if (!config.openai.apiKey) {
        return {
          message: this.createMessage('assistant', 'Sorry, the fitness coach service is not available. Please check your API configuration.'),
          success: false,
          error: 'OpenAI API key not configured'
        };
      }

      // Add user message to conversation history
      const userChatMessage = this.createMessage('user', userMessage);
      this.conversationHistory.push(userChatMessage);

      // Prepare messages for OpenAI
      const messages = [
        { role: 'system' as const, content: FITNESS_COACH_SYSTEM_PROMPT },
        ...this.conversationHistory.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      ];

      // Call OpenAI API
      const completion = await openai.chat.completions.create({
        model: config.openai.model,
        messages: messages,
        max_tokens: config.openai.maxTokens,
        temperature: config.openai.temperature,
      });

      const assistantMessage = completion.choices[0]?.message?.content || 'I apologize, but I couldn\'t generate a response. Please try again.';
      
      // Add assistant response to conversation history
      const assistantChatMessage = this.createMessage('assistant', assistantMessage);
      this.conversationHistory.push(assistantChatMessage);

      return {
        message: assistantChatMessage,
        success: true
      };

    } catch (error) {
      console.error('Chatbot error:', error);
      
      const errorMessage = this.createMessage('assistant', 'I apologize, but I\'m experiencing technical difficulties. Please try again in a moment.');
      
      return {
        message: errorMessage,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Get conversation history
   */
  getConversationHistory(): ChatMessage[] {
    return [...this.conversationHistory];
  }

  /**
   * Clear conversation history
   */
  clearConversation(): void {
    this.conversationHistory = [];
  }

  /**
   * Create a chat message object
   */
  private createMessage(role: 'user' | 'assistant', content: string): ChatMessage {
    return {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      role,
      content,
      timestamp: new Date()
    };
  }

  /**
   * Get quick fitness tips
   */
  async getQuickFitnessTips(): Promise<ChatbotResponse> {
    const tips = [
      "Start your day with a glass of water to kickstart your metabolism!",
      "Take the stairs instead of the elevator for extra daily movement.",
      "Aim for 7-9 hours of quality sleep each night for optimal recovery.",
      "Include protein in every meal to help maintain muscle mass.",
      "Stay hydrated - aim for at least 8 glasses of water daily.",
      "Practice mindful eating - eat slowly and savor each bite.",
      "Get at least 30 minutes of moderate exercise most days of the week.",
      "Include colorful vegetables in your meals for essential nutrients."
    ];

    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    return {
      message: this.createMessage('assistant', `💪 **Quick Fitness Tip:**\n\n${randomTip}`),
      success: true
    };
  }

  /**
   * Get motivational message
   */
  async getMotivationalMessage(): Promise<ChatbotResponse> {
    const motivations = [
      "Every step forward is progress! You're doing great! 🌟",
      "Your health journey is unique to you - trust the process! 💪",
      "Small consistent actions lead to big results. Keep going! 🚀",
      "You're stronger than you think - believe in yourself! 💯",
      "Every healthy choice you make is an investment in your future! 🌱",
      "Progress, not perfection. You're on the right track! ✨",
      "Your body can do amazing things - give it the fuel it needs! 🔥",
      "Remember why you started - you've got this! 💪"
    ];

    const randomMotivation = motivations[Math.floor(Math.random() * motivations.length)];
    return {
      message: this.createMessage('assistant', randomMotivation),
      success: true
    };
  }
}

// Export a singleton instance
export const fitnessCoach = new FitnessCoachChatbot();
