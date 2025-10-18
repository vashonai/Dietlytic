// Backend AI Coach Agent Service
import OpenAI from 'openai';
import { ChatMessage } from '../types/chat';

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

export interface MealInput {
  type: 'voice' | 'text';
  content: string;
  timestamp: Date;
  userId: string;
}

export interface FoodItem {
  name: string;
  quantity?: string;
  unit?: string;
  estimatedNutrition?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    sugar?: number;
  };
}

export interface MealAnalysis {
  recognizedFoods: FoodItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalSugar: number;
  healthScore: number;
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

export class BackendAICoachAgentService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  /**
   * Process user input and provide intelligent response
   */
  async processUserInput(
    mealInput: MealInput,
    userContext: any,
    conversationHistory: ChatMessage[] = []
  ): Promise<CoachResponse> {
    try {
      // Build context prompt with user's health conditions and goals
      const contextPrompt = this.buildContextPrompt(userContext);
      
      // Prepare messages for OpenAI
      const messages = [
        { role: 'system' as const, content: AI_COACH_AGENT_SYSTEM_PROMPT + '\n\n' + contextPrompt },
        ...conversationHistory.slice(-10).map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        { 
          role: 'user' as const, 
          content: `User input (${mealInput.type}): ${mealInput.content}` 
        }
      ];

      // Call OpenAI API with function calling capabilities
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: messages,
        max_tokens: 1500,
        temperature: 0.7,
        response_format: { type: "json_object" }
      });

      const responseText = completion.choices[0]?.message?.content || '{}';
      
      try {
        const response = JSON.parse(responseText);
        return {
          message: response.message,
          mealAnalysis: response.mealAnalysis,
          actionTaken: response.action?.type || 'none',
          success: true
        };
        
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError);
        return {
          message: "I apologize, but I'm having trouble processing your request. Please try again.",
          success: false,
          error: 'Failed to parse AI response'
        };
      }

    } catch (error) {
      console.error('Backend AICoachAgent error:', error);
      return {
        message: "I'm experiencing technical difficulties. Please try again in a moment.",
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Build context prompt with user's health conditions and goals
   */
  private buildContextPrompt(userContext: any): string {
    if (!userContext) return '';

    const context = [];
    
    // User basic info
    context.push(`User Profile:`);
    context.push(`- Name: ${userContext.name || 'Not specified'}`);
    context.push(`- Age: ${userContext.age || 'Not specified'}`);
    context.push(`- Weight: ${userContext.weight || 'Not specified'} kg`);
    context.push(`- Height: ${userContext.height || 'Not specified'} cm`);
    context.push(`- Activity Level: ${userContext.activity_level || 'Not specified'}`);
    context.push(`- Primary Goal: ${userContext.goal || 'Not specified'}`);
    
    // Health conditions
    if (userContext.healthConditions && userContext.healthConditions.length > 0) {
      context.push(`\nHealth Conditions:`);
      userContext.healthConditions.forEach((condition: any) => {
        context.push(`- ${condition.name} (${condition.type}, ${condition.severity})`);
        if (condition.restrictions && condition.restrictions.length > 0) {
          context.push(`  Restrictions: ${condition.restrictions.join(', ')}`);
        }
      });
    }
    
    // Dietary restrictions
    if (userContext.dietaryRestrictions && userContext.dietaryRestrictions.length > 0) {
      context.push(`\nDietary Restrictions: ${userContext.dietaryRestrictions.join(', ')}`);
    }
    
    // Current goals
    if (userContext.goals && userContext.goals.length > 0) {
      context.push(`\nCurrent Goals:`);
      userContext.goals.forEach((goal: any) => {
        context.push(`- ${goal.type}: ${goal.target}`);
        if (goal.targetValue) {
          context.push(`  Target: ${goal.targetValue} (Current: ${goal.currentValue || 'Not set'})`);
        }
      });
    }

    return context.join('\n');
  }

  /**
   * Analyze meal content and extract nutrition information
   */
  async analyzeMealContent(content: string): Promise<MealAnalysis> {
    try {
      const prompt = `Analyze the following meal description and extract food items with estimated nutrition values:

"${content}"

Return a JSON object with:
{
  "recognizedFoods": [
    {
      "name": "food name",
      "quantity": "amount",
      "unit": "unit of measurement",
      "estimatedNutrition": {
        "calories": number,
        "protein": number,
        "carbs": number,
        "fat": number,
        "sugar": number
      }
    }
  ],
  "totalCalories": number,
  "totalProtein": number,
  "totalCarbs": number,
  "totalFat": number,
  "totalSugar": number,
  "healthScore": number (1-10),
  "concerns": ["list of potential health concerns"],
  "recommendations": ["specific recommendations"]
}

Be realistic with nutrition estimates and consider typical serving sizes.`;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000,
        temperature: 0.3,
        response_format: { type: "json_object" }
      });

      const responseText = completion.choices[0]?.message?.content || '{}';
      return JSON.parse(responseText);
      
    } catch (error) {
      console.error('Error analyzing meal content:', error);
      return {
        recognizedFoods: [],
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
        totalSugar: 0,
        healthScore: 5,
        concerns: ['Unable to analyze meal content'],
        recommendations: ['Please provide more specific details about your meal']
      };
    }
  }
}

export const backendAICoachAgentService = new BackendAICoachAgentService();
