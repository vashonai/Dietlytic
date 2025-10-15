import OpenAI from 'openai';
import { ChatMessage } from '../types/chat';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
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

export class OpenAIService {
  /**
   * Send a message to the fitness coach chatbot
   */
  async sendMessage(
    userMessage: string, 
    conversationHistory: ChatMessage[] = []
  ): Promise<{ message: ChatMessage; success: boolean; error?: string }> {
    try {
      // Validate API key
      if (!process.env.OPENAI_API_KEY) {
        return {
          message: this.createMessage('assistant', 'Sorry, the fitness coach service is not available. Please check your API configuration.'),
          success: false,
          error: 'OpenAI API key not configured'
        };
      }

      // Prepare messages for OpenAI
      const messages = [
        { role: 'system' as const, content: FITNESS_COACH_SYSTEM_PROMPT },
        ...conversationHistory.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        { role: 'user' as const, content: userMessage }
      ];

      // Call OpenAI API
      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
        messages: messages,
        max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS || '1000'),
        temperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.7'),
      });

      const assistantMessage = completion.choices[0]?.message?.content || 'I apologize, but I couldn\'t generate a response. Please try again.';
      
      // Create assistant response
      const assistantChatMessage = this.createMessage('assistant', assistantMessage);

      return {
        message: assistantChatMessage,
        success: true
      };

    } catch (error) {
      console.error('OpenAI API error:', error);
      
      const errorMessage = this.createMessage('assistant', 'I apologize, but I\'m experiencing technical difficulties. Please try again in a moment.');
      
      return {
        message: errorMessage,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Get quick fitness tips
   */
  async getQuickFitnessTips(): Promise<{ tip: string; success: boolean; error?: string }> {
    try {
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
        tip: `💪 **Quick Fitness Tip:**\n\n${randomTip}`,
        success: true
      };

    } catch (error) {
      console.error('Quick tips error:', error);
      return {
        tip: '',
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get fitness tip'
      };
    }
  }

  /**
   * Get motivational message
   */
  async getMotivationalMessage(): Promise<{ message: string; success: boolean; error?: string }> {
    try {
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
        message: randomMotivation,
        success: true
      };

    } catch (error) {
      console.error('Motivation error:', error);
      return {
        message: '',
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get motivational message'
      };
    }
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
}

// Export singleton instance
export const openaiService = new OpenAIService();
