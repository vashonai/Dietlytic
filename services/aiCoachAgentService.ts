// Enhanced AI Coach Agent Service with voice input, food recognition, and health-aware feedback
import { config } from '@/config/environment';
import { NutritionData } from './nutritionService';
import { supabaseService } from './supabaseService';
import { EnhancedUserProfile, userProfileService } from './userProfileService';

// Note: OpenAI client is handled by the backend API

export interface MealInput {
  type: 'voice' | 'text';
  content: string;
  timestamp: Date;
}

export interface FoodItem {
  name: string;
  quantity?: string;
  unit?: string;
  estimatedNutrition?: Partial<NutritionData>;
}

export interface MealAnalysis {
  recognizedFoods: FoodItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalSugar: number;
  healthScore: number; // 1-10 scale
  concerns: string[];
  recommendations: string[];
}

export interface CoachResponse {
  message: string;
  mealAnalysis?: MealAnalysis;
  actionTaken?: 'logged_meal' | 'updated_goal' | 'updated_profile' | 'none';
  success: boolean;
  error?: string;
}

export interface AgentAction {
  type: 'log_meal' | 'update_goal' | 'update_profile' | 'provide_feedback' | 'ask_clarification';
  data?: any;
  message: string;
}

// Enhanced system prompt for health-aware AI coach
const AI_COACH_AGENT_SYSTEM_PROMPT = `You are NutriHelp AI Coach Agent, an advanced health and nutrition assistant with the following capabilities:

## Your Role:
- Analyze user meal inputs (voice/text) and extract food information
- Provide personalized feedback based on user's health conditions and goals
- Log meals to food history
- Update user goals and profile information
- Give health-conscious recommendations

## Key Guidelines:

### Health Condition Awareness:
- If user has diabetes: strongly discourage high-sugar foods, recommend low-GI alternatives
- If user has hypertension: recommend low-sodium options, avoid processed foods
- If user has heart conditions: focus on heart-healthy fats, limit saturated fats
- If user has allergies/intolerances: strictly avoid triggering foods
- Always consider medication interactions and dietary restrictions

### Goal-Based Feedback:
- Weight loss: emphasize calorie deficit, portion control, nutrient density
- Weight gain: focus on healthy calories, protein intake, strength training nutrition
- Muscle building: prioritize protein timing and quality
- General health: emphasize balanced nutrition, variety, whole foods

### Communication Style:
- Be supportive but firm when health is at risk
- Use encouraging language for positive choices
- Provide specific, actionable recommendations
- Ask clarifying questions when needed
- Be culturally sensitive and inclusive

### Actions You Can Take:
1. **log_meal**: Save meal data to user's food history
2. **update_goal**: Modify user goals based on conversation
3. **update_profile**: Update health conditions or dietary restrictions
4. **provide_feedback**: Give nutrition advice and recommendations
5. **ask_clarification**: Request more details about food or goals

## Response Format:
Always respond with a JSON object containing:
{
  "message": "Your response to the user",
  "action": {
    "type": "action_type",
    "data": {relevant_data_if_any},
    "message": "Description of action taken"
  },
  "mealAnalysis": {
    "recognizedFoods": [{"name": "food_name", "quantity": "amount", "unit": "unit"}],
    "totalCalories": number,
    "totalProtein": number,
    "totalCarbs": number,
    "totalFat": number,
    "totalSugar": number,
    "healthScore": number,
    "concerns": ["list of health concerns"],
    "recommendations": ["specific recommendations"]
  }
}

Be thorough in your analysis and always prioritize user health and safety.`;

export class AICoachAgentService {
  private conversationHistory: any[] = [];
  private currentUserProfile: EnhancedUserProfile | null = null;

  constructor() {
    this.initializeUserProfile();
  }

  private async initializeUserProfile() {
    this.currentUserProfile = await userProfileService.getCurrentProfile();
  }

  /**
   * Process user input (voice or text) and provide intelligent response
   */
  async processUserInput(input: MealInput): Promise<CoachResponse> {
    try {
      // Refresh user profile
      await this.initializeUserProfile();
      
      if (!this.currentUserProfile) {
        return {
          message: "I need to access your profile to provide personalized advice. Please ensure you're logged in.",
          success: false,
          error: 'User profile not available'
        };
      }

      try {
        // Call backend API for AI Coach processing
        const response = await fetch(`${config.api.baseUrl}/chat/ai-coach`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: input.type,
            content: input.content,
            userId: this.currentUserProfile.id,
            userContext: this.currentUserProfile,
            conversationHistory: this.conversationHistory.slice(-10)
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.success) {
          // Add to conversation history
          this.conversationHistory.push({
            role: 'user',
            content: input.content
          });
          this.conversationHistory.push({
            role: 'assistant',
            content: result.message
          });

          // Process the agent's response and take actions
          const finalResult = await this.processAgentResponse(result, input);
          return finalResult;
        } else {
          return {
            message: result.message || "I'm sorry, I encountered an error processing your request.",
            success: false,
            error: result.error
          };
        }
      } catch (fetchError) {
        // Fallback response when backend is not available
        console.warn('Backend API not available, using fallback response:', fetchError);
        
        const fallbackResponse = this.generateFallbackResponse(input);
        
        // Add to conversation history
        this.conversationHistory.push({
          role: 'user',
          content: input.content
        });
        this.conversationHistory.push({
          role: 'assistant',
          content: fallbackResponse.message
        });

        return fallbackResponse;
      }

    } catch (error) {
      console.error('AICoachAgent error:', error);
      return {
        message: "I'm experiencing technical difficulties. Please try again in a moment.",
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Generate fallback response when backend is not available
   */
  private generateFallbackResponse(input: MealInput): CoachResponse {
    const lowerContent = input.content.toLowerCase();
    
    // Simple keyword-based responses
    if (lowerContent.includes('ate') || lowerContent.includes('food') || lowerContent.includes('meal')) {
      return {
        message: "I understand you're telling me about food you've eaten. While I can't fully analyze your meal right now (my advanced features are temporarily unavailable), I'd love to help you track your nutrition. Could you tell me more about what you had?",
        success: true,
        actionTaken: 'none'
      };
    }
    
    if (lowerContent.includes('goal') || lowerContent.includes('target')) {
      return {
        message: "I'd be happy to help you set or update your health goals! While my full goal-setting features are temporarily unavailable, you can still set goals manually in your profile. What kind of goal are you thinking about?",
        success: true,
        actionTaken: 'none'
      };
    }
    
    if (lowerContent.includes('help') || lowerContent.includes('advice')) {
      return {
        message: "I'm here to help! While my advanced AI features are temporarily unavailable, I can still provide general nutrition advice. What would you like to know about healthy eating?",
        success: true,
        actionTaken: 'none'
      };
    }
    
    // Default response
    return {
      message: "Thanks for your message! I'm your NutriHelp AI Coach, and while my advanced features are temporarily unavailable, I'm still here to help with basic nutrition guidance. What would you like to know?",
      success: true,
      actionTaken: 'none'
    };
  }

  /**
   * Build context prompt with user's health conditions and goals
   */
  private buildContextPrompt(): string {
    if (!this.currentUserProfile) return '';

    const context = [];
    
    // User basic info
    context.push(`User Profile:`);
    context.push(`- Name: ${this.currentUserProfile.name}`);
    context.push(`- Age: ${this.currentUserProfile.age || 'Not specified'}`);
    context.push(`- Weight: ${this.currentUserProfile.weight || 'Not specified'} kg`);
    context.push(`- Height: ${this.currentUserProfile.height || 'Not specified'} cm`);
    context.push(`- Activity Level: ${this.currentUserProfile.activity_level}`);
    context.push(`- Primary Goal: ${this.currentUserProfile.goal}`);
    
    // Health conditions
    if (this.currentUserProfile.healthConditions.length > 0) {
      context.push(`\nHealth Conditions:`);
      this.currentUserProfile.healthConditions.forEach(condition => {
        context.push(`- ${condition.name} (${condition.type}, ${condition.severity})`);
        if (condition.restrictions.length > 0) {
          context.push(`  Restrictions: ${condition.restrictions.join(', ')}`);
        }
      });
    }
    
    // Dietary restrictions
    if (this.currentUserProfile.dietaryRestrictions.length > 0) {
      context.push(`\nDietary Restrictions: ${this.currentUserProfile.dietaryRestrictions.join(', ')}`);
    }
    
    // Current goals
    if (this.currentUserProfile.goals.length > 0) {
      context.push(`\nCurrent Goals:`);
      this.currentUserProfile.goals.forEach(goal => {
        context.push(`- ${goal.type}: ${goal.target}`);
        if (goal.targetValue) {
          context.push(`  Target: ${goal.targetValue} (Current: ${goal.currentValue || 'Not set'})`);
        }
      });
    }

    return context.join('\n');
  }

  /**
   * Process agent response and execute actions
   */
  private async processAgentResponse(response: any, input: MealInput): Promise<CoachResponse> {
    let actionTaken: CoachResponse['actionTaken'] = 'none';
    
    try {
      // Execute the agent's recommended action
      if (response.action) {
        switch (response.action.type) {
          case 'log_meal':
            if (response.mealAnalysis?.recognizedFoods?.length > 0) {
              await this.logMealToHistory(response.mealAnalysis, input);
              actionTaken = 'logged_meal';
            }
            break;
            
          case 'update_goal':
            if (response.action.data) {
              await this.updateUserGoal(response.action.data);
              actionTaken = 'updated_goal';
            }
            break;
            
          case 'update_profile':
            if (response.action.data) {
              await this.updateUserProfile(response.action.data);
              actionTaken = 'updated_profile';
            }
            break;
        }
      }

      return {
        message: response.message,
        mealAnalysis: response.mealAnalysis,
        actionTaken,
        success: true
      };
      
    } catch (error) {
      console.error('Error processing agent response:', error);
      return {
        message: response.message || "I processed your request but encountered an issue saving the data.",
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Log meal to user's food history
   */
  private async logMealToHistory(mealAnalysis: MealAnalysis, input: MealInput): Promise<void> {
    try {
      // Create a simplified nutrition entry for each recognized food
      for (const food of mealAnalysis.recognizedFoods) {
        const nutritionData: NutritionData = {
          food_name: food.name,
          nf_calories: food.estimatedNutrition?.nf_calories || 0,
          nf_protein: food.estimatedNutrition?.nf_protein || 0,
          nf_total_carbohydrate: food.estimatedNutrition?.nf_total_carbohydrate || 0,
          nf_total_fat: food.estimatedNutrition?.nf_total_fat || 0,
          nf_dietary_fiber: food.estimatedNutrition?.nf_dietary_fiber || 0,
          nf_sugars: food.estimatedNutrition?.nf_sugars || 0,
          nf_sodium: food.estimatedNutrition?.nf_sodium || 0,
          serving_weight_grams: 100, // Default serving size
          nf_iron: food.estimatedNutrition?.nf_iron || 0,
        };

        await supabaseService.saveNutritionEntry(
          food.name,
          nutritionData
        );
      }
    } catch (error) {
      console.error('Error logging meal to history:', error);
      throw error;
    }
  }

  /**
   * Update user goal based on agent recommendation
   */
  private async updateUserGoal(goalData: any): Promise<void> {
    try {
      if (goalData.id) {
        // Update existing goal
        await userProfileService.updateUserGoal(goalData.id, goalData);
      } else {
        // Create new goal
        await userProfileService.addUserGoal(goalData);
      }
    } catch (error) {
      console.error('Error updating user goal:', error);
      throw error;
    }
  }

  /**
   * Update user profile based on agent recommendation
   */
  private async updateUserProfile(profileData: any): Promise<void> {
    try {
      if (profileData.healthConditions) {
        for (const condition of profileData.healthConditions) {
          if (condition.id) {
            await userProfileService.updateHealthCondition(condition.id, condition);
          } else {
            await userProfileService.addHealthCondition(condition);
          }
        }
      }
      
      if (profileData.dietaryRestrictions) {
        await userProfileService.updateDietaryRestrictions(profileData.dietaryRestrictions);
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  /**
   * Get conversation history
   */
  getConversationHistory(): any[] {
    return [...this.conversationHistory];
  }

  /**
   * Clear conversation history
   */
  clearConversationHistory(): void {
    this.conversationHistory = [];
  }

  /**
   * Refresh user profile
   */
  async refreshUserProfile(): Promise<void> {
    await this.initializeUserProfile();
  }

  /**
   * Process scanned food item and provide nutritional feedback
   */
  async processScannedFood(
    foodName: string, 
    nutritionData: NutritionData, 
    imageUri?: string
  ): Promise<CoachResponse> {
    try {
      // Refresh user profile
      await this.initializeUserProfile();

      if (!this.currentUserProfile) {
        return {
          message: "I need to access your profile to provide personalized advice. Please ensure you're logged in.",
          success: false,
          error: 'User profile not available'
        };
      }

      try {
        // Call backend API for AI Coach processing of scanned food
        const response = await fetch(`${config.api.baseUrl}/chat/analyze-scanned-food`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            foodName,
            nutritionData,
            imageUri,
            userId: this.currentUserProfile.id,
            userContext: this.currentUserProfile,
            conversationHistory: this.conversationHistory.slice(-10)
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
          // Add to conversation history
          this.conversationHistory.push({
            role: 'user',
            content: `I scanned ${foodName}`
          });
          this.conversationHistory.push({
            role: 'assistant',
            content: result.message
          });

          // Process the agent's response and take actions
          const finalResult = await this.processAgentResponse(result, {
            type: 'text',
            content: `I scanned ${foodName}`,
            timestamp: new Date()
          });
          return finalResult;
        } else {
          return {
            message: result.message || "I'm sorry, I encountered an error analyzing your scanned food.",
            success: false,
            error: result.error
          };
        }
      } catch (fetchError) {
        // Fallback response when backend is not available
        console.warn('Backend API not available, using fallback response:', fetchError);

        const fallbackResponse = this.generateScannedFoodFallbackResponse(foodName, nutritionData);

        // Add to conversation history
        this.conversationHistory.push({
          role: 'user',
          content: `I scanned ${foodName}`
        });
        this.conversationHistory.push({
          role: 'assistant',
          content: fallbackResponse.message
        });

        return fallbackResponse;
      }

    } catch (error) {
      console.error('AICoachAgent error processing scanned food:', error);
      return {
        message: "I'm experiencing technical difficulties analyzing your scanned food. Please try again in a moment.",
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Generate fallback response for scanned food when backend is not available
   */
  private generateScannedFoodFallbackResponse(foodName: string, nutritionData: NutritionData): CoachResponse {
    const calories = nutritionData.nf_calories;
    const protein = nutritionData.nf_protein;
    const carbs = nutritionData.nf_total_carbohydrate;
    const fat = nutritionData.nf_total_fat;
    const sugar = nutritionData.nf_sugars;
    const sodium = nutritionData.nf_sodium;

    let message = `Great! I can see you scanned ${foodName}. Here's what I found:\n\n`;
    message += `📊 **Nutritional Information:**\n`;
    message += `• Calories: ${calories} kcal\n`;
    message += `• Protein: ${protein}g\n`;
    message += `• Carbs: ${carbs}g\n`;
    message += `• Fat: ${fat}g\n`;
    message += `• Sugar: ${sugar}g\n`;
    message += `• Sodium: ${sodium}mg\n\n`;

    // Basic health feedback based on nutritional data
    if (sugar > 15) {
      message += `⚠️ **Note:** This item is high in sugar (${sugar}g). Consider moderation, especially if you're managing diabetes.\n\n`;
    }

    if (sodium > 600) {
      message += `⚠️ **Note:** This item is high in sodium (${sodium}mg). Consider this if you're watching your blood pressure.\n\n`;
    }

    if (protein > 20) {
      message += `✅ **Great choice!** This item is high in protein (${protein}g), which is excellent for muscle building and satiety.\n\n`;
    }

    message += `While my advanced AI features are temporarily unavailable, I can still help you track this meal. Would you like me to log this to your food history?`;

    return {
      message,
      success: true,
      actionTaken: 'none',
      data: { foodName, nutritionData }
    };
  }
}

export const aiCoachAgentService = new AICoachAgentService();
