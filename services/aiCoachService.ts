// AI Coach Service for personalized dietary advice
import { NutritionData } from './nutritionService';

export interface UserGoals {
  weightGoal: 'lose' | 'maintain' | 'gain';
  targetWeight?: number;
  currentWeight?: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  dietaryRestrictions: string[];
  healthConditions: string[];
  targetCalories?: number;
  targetProtein?: number;
  targetCarbs?: number;
  targetFat?: number;
}

export interface FoodAnalysis {
  foodName: string;
  nutritionData: NutritionData;
  isHealthy: boolean;
  healthScore: number; // 0-100
  concerns: string[];
  benefits: string[];
  recommendations: string[];
}

export interface AICoachAdvice {
  message: string;
  type: 'positive' | 'warning' | 'suggestion' | 'motivation';
  actionItems: string[];
  relatedTips: string[];
}

export class AICoachService {
  private static instance: AICoachService;
  private userGoals: UserGoals | null = null;

  static getInstance(): AICoachService {
    if (!AICoachService.instance) {
      AICoachService.instance = new AICoachService();
    }
    return AICoachService.instance;
  }

  // Set user goals and preferences
  setUserGoals(goals: UserGoals) {
    this.userGoals = goals;
  }

  // Get current user goals
  getUserGoals(): UserGoals | null {
    return this.userGoals;
  }

  // Analyze food and provide personalized advice
  analyzeFood(nutritionData: NutritionData): FoodAnalysis {
    const foodName = nutritionData.food_name.toLowerCase();
    const calories = nutritionData.nf_calories || 0;
    const protein = nutritionData.nf_protein || 0;
    const carbs = nutritionData.nf_total_carbohydrate || 0;
    const fat = nutritionData.nf_total_fat || 0;
    const sugar = nutritionData.nf_sugars || 0;
    const sodium = nutritionData.nf_sodium || 0;
    const fiber = nutritionData.nf_dietary_fiber || 0;

    // Calculate health score (0-100)
    let healthScore = 100;
    const concerns: string[] = [];
    const benefits: string[] = [];
    const recommendations: string[] = [];

    // Check for unhealthy indicators
    if (sugar > 20) {
      healthScore -= 20;
      concerns.push('High sugar content');
      recommendations.push('Consider reducing sugar intake');
    }
    
    if (sodium > 600) {
      healthScore -= 15;
      concerns.push('High sodium content');
      recommendations.push('Watch your sodium intake for blood pressure');
    }
    
    if (fat > 15) {
      healthScore -= 10;
      concerns.push('High fat content');
    }
    
    if (calories > 500) {
      healthScore -= 10;
      concerns.push('High calorie content');
    }

    // Check for healthy indicators
    if (protein > 15) {
      healthScore += 10;
      benefits.push('Good protein content');
    }
    
    if (fiber > 5) {
      healthScore += 15;
      benefits.push('High fiber content');
    }

    // Check for junk food indicators
    const junkFoodKeywords = ['chips', 'candy', 'soda', 'coke', 'pepsi', 'burger', 'fries', 'pizza', 'donut', 'cake', 'cookie', 'ice cream', 'chocolate'];
    const isJunkFood = junkFoodKeywords.some(keyword => foodName.includes(keyword));
    
    if (isJunkFood) {
      healthScore -= 30;
      concerns.push('Processed/junk food detected');
      recommendations.push('Consider healthier alternatives');
    }

    // Check for healthy food indicators
    const healthyKeywords = ['apple', 'banana', 'orange', 'broccoli', 'spinach', 'salad', 'chicken', 'fish', 'salmon', 'quinoa', 'oats', 'yogurt'];
    const isHealthyFood = healthyKeywords.some(keyword => foodName.includes(keyword));
    
    if (isHealthyFood) {
      healthScore += 20;
      benefits.push('Nutritious food choice');
    }

    // Ensure health score is within bounds
    healthScore = Math.max(0, Math.min(100, healthScore));

    const isHealthy = healthScore >= 70;

    return {
      foodName: nutritionData.food_name,
      nutritionData,
      isHealthy,
      healthScore,
      concerns,
      benefits,
      recommendations
    };
  }

  // Generate personalized AI coach advice
  generateAdvice(foodAnalysis: FoodAnalysis): AICoachAdvice {
    const { foodName, isHealthy, healthScore, concerns, benefits, recommendations } = foodAnalysis;
    const goals = this.userGoals;

    let message = '';
    let type: 'positive' | 'warning' | 'suggestion' | 'motivation' = 'suggestion';
    const actionItems: string[] = [];
    const relatedTips: string[] = [];

    if (isHealthy) {
      // Positive feedback for healthy choices
      message = `Great choice with ${foodName}! 🎉`;
      type = 'positive';
      
      if (benefits.length > 0) {
        message += ` This food is ${benefits.join(', ').toLowerCase()}.`;
      }
      
      if (goals?.weightGoal === 'lose') {
        message += ` Perfect for your weight loss goals!`;
        actionItems.push('Keep up the healthy eating!');
        relatedTips.push('Consider adding more vegetables to your next meal');
      } else if (goals?.weightGoal === 'gain') {
        message += ` Good for muscle building!`;
        actionItems.push('Consider adding a protein source');
        relatedTips.push('Pair with complex carbs for better nutrition');
      }
    } else {
      // Warning/suggestion for unhealthy choices
      if (healthScore < 30) {
        message = `⚠️ ${foodName} might not be the best choice for your health goals.`;
        type = 'warning';
      } else {
        message = `🤔 ${foodName} could be improved for better nutrition.`;
        type = 'suggestion';
      }

      if (concerns.length > 0) {
        message += ` I noticed: ${concerns.join(', ').toLowerCase()}.`;
      }

      // Personalized advice based on goals
      if (goals?.weightGoal === 'lose') {
        message += ` This might slow down your weight loss progress.`;
        actionItems.push('Try a healthier alternative');
        actionItems.push('Add more vegetables to balance the meal');
        relatedTips.push('Consider grilled chicken instead of fried');
        relatedTips.push('Try air-fried vegetables as a side');
      } else if (goals?.weightGoal === 'gain') {
        message += ` While high in calories, the nutrition quality could be better.`;
        actionItems.push('Add lean protein to this meal');
        actionItems.push('Include some vegetables for nutrients');
        relatedTips.push('Try adding avocado for healthy fats');
        relatedTips.push('Consider a protein smoothie as a supplement');
      }

      // Specific advice for junk food
      const junkFoodKeywords = ['chips', 'candy', 'soda', 'coke', 'pepsi', 'burger', 'fries', 'pizza', 'donut', 'cake', 'cookie', 'ice cream', 'chocolate'];
      const isJunkFood = junkFoodKeywords.some(keyword => foodName.includes(keyword));
      
      if (isJunkFood) {
        message += `\n\n💡 Here's how to counteract this choice:`;
        actionItems.push('Drink extra water to help flush out sodium');
        actionItems.push('Take a 20-minute walk to burn some calories');
        actionItems.push('Eat a salad with your next meal');
        actionItems.push('Choose a healthier snack next time');
        
        relatedTips.push('Try baked sweet potato fries instead of regular fries');
        relatedTips.push('Dark chocolate (70%+) is a better sweet treat');
        relatedTips.push('Homemade smoothies can satisfy sweet cravings');
      }
    }

    // Add motivational messages
    if (healthScore < 50) {
      relatedTips.push('Remember: progress, not perfection!');
      relatedTips.push('Every healthy choice counts towards your goals');
    }

    return {
      message,
      type,
      actionItems,
      relatedTips
    };
  }

  // Get general motivational tips
  getMotivationalTip(): string {
    const tips = [
      "Every healthy choice is a step towards your goals! 💪",
      "Remember: you're not just eating for today, but for your future self! 🌟",
      "Small changes lead to big results. Keep going! 🚀",
      "Your body is your temple. Treat it with love and respect! ❤️",
      "Progress over perfection. You're doing great! 👏",
      "Every meal is a chance to nourish your body better! 🥗",
      "Consistency is key. You've got this! 🔥",
      "Your health is an investment, not an expense! 💎"
    ];
    
    return tips[Math.floor(Math.random() * tips.length)];
  }

  // Get quick health tips based on time of day
  getQuickTip(): string {
    const hour = new Date().getHours();
    
    if (hour < 12) {
      return "Start your day with a protein-rich breakfast! 🍳";
    } else if (hour < 18) {
      return "Stay hydrated! Aim for 8 glasses of water today 💧";
    } else {
      return "Light dinner helps with better sleep and digestion 🌙";
    }
  }

  // Analyze meal timing and provide advice
  analyzeMealTiming(): string {
    const hour = new Date().getHours();
    
    if (hour < 10) {
      return "Great time for breakfast! Your metabolism is ready to work 🍳";
    } else if (hour < 12) {
      return "Perfect for a mid-morning snack to keep energy stable 🥜";
    } else if (hour < 14) {
      return "Lunch time! Fuel your afternoon with nutritious foods 🥗";
    } else if (hour < 16) {
      return "Afternoon snack time! Choose something with protein 🧀";
    } else if (hour < 19) {
      return "Dinner time! Keep it balanced and not too heavy 🍽️";
    } else {
      return "Late night eating? Try to keep it light and healthy 🌙";
    }
  }
}

export const aiCoachService = AICoachService.getInstance();
