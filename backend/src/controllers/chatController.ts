import { Request, Response } from 'express';
import { backendAICoachAgentService, MealInput } from '../services/aiCoachAgentService';
import { openaiService } from '../services/openaiService';
import { ChatRequest, ChatResponse, MotivationResponse, QuickTipResponse } from '../types/chat';

export class ChatController {
  /**
   * Send a message to the fitness coach
   */
  async sendMessage(req: Request, res: Response): Promise<void> {
    try {
      const { message, conversationHistory = [], userId }: ChatRequest = req.body;

      // Validate input
      if (!message || typeof message !== 'string' || message.trim().length === 0) {
        res.status(400).json({
          success: false,
          error: 'Message is required and must be a non-empty string'
        } as ChatResponse);
        return;
      }

      if (message.length > 1000) {
        res.status(400).json({
          success: false,
          error: 'Message is too long. Please keep it under 1000 characters.'
        } as ChatResponse);
        return;
      }

      // Validate conversation history
      if (!Array.isArray(conversationHistory)) {
        res.status(400).json({
          success: false,
          error: 'Conversation history must be an array'
        } as ChatResponse);
        return;
      }

      // Limit conversation history to last 20 messages to prevent token overflow
      const limitedHistory = conversationHistory.slice(-20);

      // Send message to OpenAI service
      const result = await openaiService.sendMessage(message.trim(), limitedHistory);

      if (result.success) {
        // Add the new message to conversation history
        const updatedHistory = [...limitedHistory, result.message];

        res.status(200).json({
          success: true,
          message: result.message,
          conversationHistory: updatedHistory
        } as ChatResponse);
      } else {
        res.status(500).json({
          success: false,
          error: result.error || 'Failed to process message'
        } as ChatResponse);
      }

    } catch (error) {
      console.error('Chat controller error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      } as ChatResponse);
    }
  }

  /**
   * Get a quick fitness tip
   */
  async getQuickTip(req: Request, res: Response): Promise<void> {
    try {
      const result = await openaiService.getQuickFitnessTips();

      if (result.success) {
        res.status(200).json({
          success: true,
          tip: result.tip
        } as QuickTipResponse);
      } else {
        res.status(500).json({
          success: false,
          error: result.error || 'Failed to get fitness tip'
        } as QuickTipResponse);
      }

    } catch (error) {
      console.error('Quick tip controller error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      } as QuickTipResponse);
    }
  }

  /**
   * Get a motivational message
   */
  async getMotivation(req: Request, res: Response): Promise<void> {
    try {
      const result = await openaiService.getMotivationalMessage();

      if (result.success) {
        res.status(200).json({
          success: true,
          message: result.message
        } as MotivationResponse);
      } else {
        res.status(500).json({
          success: false,
          error: result.error || 'Failed to get motivational message'
        } as MotivationResponse);
      }

    } catch (error) {
      console.error('Motivation controller error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      } as MotivationResponse);
    }
  }

  /**
   * Process AI Coach Agent input (voice or text)
   */
  async processAICoachInput(req: Request, res: Response): Promise<void> {
    try {
      const { type, content, userId, userContext, conversationHistory = [] } = req.body;

      // Validate input
      if (!content || typeof content !== 'string' || content.trim().length === 0) {
        res.status(400).json({
          success: false,
          error: 'Content is required and must be a non-empty string'
        });
        return;
      }

      if (!type || !['voice', 'text'].includes(type)) {
        res.status(400).json({
          success: false,
          error: 'Type must be either "voice" or "text"'
        });
        return;
      }

      if (!userId) {
        res.status(400).json({
          success: false,
          error: 'User ID is required'
        });
        return;
      }

      // Create meal input object
      const mealInput: MealInput = {
        type,
        content: content.trim(),
        timestamp: new Date(),
        userId
      };

      // Process input with AI Coach Agent
      const result = await backendAICoachAgentService.processUserInput(
        mealInput,
        userContext,
        conversationHistory
      );

      res.status(200).json(result);

    } catch (error) {
      console.error('AI Coach Agent controller error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Analyze meal content
   */
  async analyzeMealContent(req: Request, res: Response): Promise<void> {
    try {
      const { content } = req.body;

      if (!content || typeof content !== 'string' || content.trim().length === 0) {
        res.status(400).json({
          success: false,
          error: 'Content is required and must be a non-empty string'
        });
        return;
      }

      const analysis = await backendAICoachAgentService.analyzeMealContent(content);

      res.status(200).json({
        success: true,
        analysis
      });

    } catch (error) {
      console.error('Meal analysis controller error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Clear conversation history (for future use)
   */
  async clearConversation(req: Request, res: Response): Promise<void> {
    try {
      // In a real app, you might want to store conversation history in a database
      // For now, we'll just return success since the frontend handles its own state
      res.status(200).json({
        success: true,
        message: 'Conversation cleared successfully'
      });
    } catch (error) {
      console.error('Clear conversation error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
}

// Export singleton instance
export const chatController = new ChatController();
