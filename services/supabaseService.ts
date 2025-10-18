// Supabase service for storing user nutrition data
import { API_KEYS } from '@/config/apiKeys';
import { createClient } from '@supabase/supabase-js';
import { NutritionData } from './nutritionService';

// Database types matching the SQL schema
export interface User {
  id: string;
  email: string;
  name: string;
  age?: number;
  weight?: number;
  height?: number;
  activity_level: string;
  goal: string;
  created_at: string;
  updated_at: string;
}

export interface Meal {
  id: string;
  user_id: string;
  image_uri?: string;
  image_type: string;
  detected_items: string[];
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fat: number;
  total_fiber: number;
  total_sugar: number;
  total_sodium: number;
  created_at: string;
}

export interface MealItem {
  id: string;
  meal_id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  serving_weight_grams: number;
  created_at: string;
}

export interface NutritionEntry {
  id?: string;
  meal: Meal;
  items: MealItem[];
  created_at: string;
}

class SupabaseService {
  public supabase;
  private currentUserId: string | null = null;

  constructor() {
    this.supabase = createClient(API_KEYS.SUPABASE_URL, API_KEYS.SUPABASE_ANON_KEY);
    
    // Initialize with anonymous authentication
    this.initializeAuth();
  }

  private async initializeAuth() {
    try {
      // Since anonymous auth is disabled, we'll use a fixed demo user ID
      // and create the user record if it doesn't exist
      this.currentUserId = '00000000-0000-0000-0000-000000000001';
      console.log('Using demo user ID:', this.currentUserId);
      
      // Try to create the user record if it doesn't exist
      await this.ensureUserExists();
    } catch (error) {
      console.error('Error initializing auth:', error);
      this.currentUserId = '00000000-0000-0000-0000-000000000001';
    }
  }

  // Create or get the current user
  async getCurrentUser(): Promise<User | null> {
    if (!this.currentUserId) return null;

    try {
      const { data, error } = await this.supabase
        .from('users')
        .select('*')
        .eq('id', this.currentUserId)
        .single();

      if (error && error.code === 'PGRST116') {
        // User doesn't exist, create user record for authenticated user
        return await this.createUserRecord();
      }

      return data;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // Create user record for authenticated user
  private async createUserRecord(): Promise<User | null> {
    try {
      const userRecord: Omit<User, 'created_at' | 'updated_at'> = {
        id: this.currentUserId!,
        email: 'user@dietlytic.com',
        name: 'NutriHelp User',
        age: 25,
        weight: 70,
        height: 175,
        activity_level: 'moderate',
        goal: 'maintain',
      };

      const { data, error } = await this.supabase
        .from('users')
        .insert(userRecord)
        .select()
        .single();

      if (error) {
        console.error('Error creating user record:', error);
        return null;
      }

      // Also create user preferences
      await this.supabase
        .from('user_preferences')
        .insert({
          user_id: this.currentUserId!,
          meal_reminders: true,
          fasting_reminders: true,
          weekly_reports: true,
          coach_messages: true,
        });

      return data;
    } catch (error) {
      console.error('Error creating user record:', error);
      return null;
    }
  }

  // Save nutrition entry (meal + meal items)
  async saveNutritionEntry(
    foodName: string,
    nutritionData: NutritionData,
    imageUri?: string
  ): Promise<string | null> {
    // Ensure user is authenticated
    await this.ensureUserAuthenticated();
    
    if (!this.currentUserId) {
      throw new Error('User not authenticated');
    }

    try {
      // Create meal record
      const mealData: Omit<Meal, 'id' | 'created_at'> = {
        user_id: this.currentUserId,
        image_uri: imageUri,
        image_type: 'camera',
        detected_items: [foodName],
        total_calories: nutritionData.nf_calories,
        total_protein: nutritionData.nf_protein,
        total_carbs: nutritionData.nf_total_carbohydrate,
        total_fat: nutritionData.nf_total_fat,
        total_fiber: nutritionData.nf_dietary_fiber,
        total_sugar: nutritionData.nf_sugars,
        total_sodium: nutritionData.nf_sodium,
      };

      const { data: meal, error: mealError } = await this.supabase
        .from('meals')
        .insert(mealData)
        .select()
        .single();

      if (mealError) {
        console.error('Error saving meal:', mealError);
        throw new Error('Failed to save meal');
      }

      // Create meal item record
      const mealItemData: Omit<MealItem, 'id' | 'meal_id' | 'created_at'> = {
        name: foodName,
        calories: nutritionData.nf_calories,
        protein: nutritionData.nf_protein,
        carbs: nutritionData.nf_total_carbohydrate,
        fat: nutritionData.nf_total_fat,
        fiber: nutritionData.nf_dietary_fiber,
        sugar: nutritionData.nf_sugars,
        sodium: nutritionData.nf_sodium,
        serving_weight_grams: nutritionData.serving_weight_grams,
      };

      const { error: itemError } = await this.supabase
        .from('meal_items')
        .insert({
          ...mealItemData,
          meal_id: meal.id,
        });

      if (itemError) {
        console.error('Error saving meal item:', itemError);
        throw new Error('Failed to save meal item');
      }

      return meal.id;
    } catch (error) {
      console.error('Error saving nutrition entry:', error);
      throw new Error('Failed to save nutrition data');
    }
  }

  // Get nutrition history
  async getNutritionHistory(limitCount: number = 50): Promise<NutritionEntry[]> {
    // Ensure user is authenticated
    await this.ensureUserAuthenticated();
    
    if (!this.currentUserId) {
      throw new Error('User not authenticated');
    }

    try {
      const { data: meals, error: mealsError } = await this.supabase
        .from('meals')
        .select(`
          *,
          meal_items (*)
        `)
        .eq('user_id', this.currentUserId)
        .order('created_at', { ascending: false })
        .limit(limitCount);

      if (mealsError) {
        console.error('Error fetching nutrition history:', mealsError);
        throw new Error('Failed to fetch nutrition history');
      }

      return meals.map(meal => ({
        id: meal.id,
        meal: {
          id: meal.id,
          user_id: meal.user_id,
          image_uri: meal.image_uri,
          image_type: meal.image_type,
          detected_items: meal.detected_items,
          total_calories: meal.total_calories,
          total_protein: meal.total_protein,
          total_carbs: meal.total_carbs,
          total_fat: meal.total_fat,
          total_fiber: meal.total_fiber,
          total_sugar: meal.total_sugar,
          total_sodium: meal.total_sodium,
          created_at: meal.created_at,
        },
        items: meal.meal_items || [],
        created_at: meal.created_at,
      }));
    } catch (error) {
      console.error('Error fetching nutrition history:', error);
      throw new Error('Failed to fetch nutrition history');
    }
  }

  // Get user statistics
  async getUserStats(days: number = 7): Promise<{
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
    mealCount: number;
  }> {
    if (!this.currentUserId) {
      throw new Error('User not authenticated');
    }

    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await this.supabase
        .from('meals')
        .select('total_calories, total_protein, total_carbs, total_fat')
        .eq('user_id', this.currentUserId)
        .gte('created_at', startDate.toISOString());

      if (error) {
        console.error('Error fetching user stats:', error);
        throw new Error('Failed to fetch user statistics');
      }

      const stats = data.reduce(
        (acc, meal) => ({
          totalCalories: acc.totalCalories + (meal.total_calories || 0),
          totalProtein: acc.totalProtein + (meal.total_protein || 0),
          totalCarbs: acc.totalCarbs + (meal.total_carbs || 0),
          totalFat: acc.totalFat + (meal.total_fat || 0),
          mealCount: acc.mealCount + 1,
        }),
        {
          totalCalories: 0,
          totalProtein: 0,
          totalCarbs: 0,
          totalFat: 0,
          mealCount: 0,
        }
      );

      return stats;
    } catch (error) {
      console.error('Error calculating user stats:', error);
      throw new Error('Failed to calculate user statistics');
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.currentUserId !== null;
  }

  // Ensure user exists in the database
  private async ensureUserExists() {
    if (!this.currentUserId) return;
    
    try {
      // Check if user exists
      const { data, error } = await this.supabase
        .from('users')
        .select('id')
        .eq('id', this.currentUserId)
        .single();
      
      if (error && error.code === 'PGRST116') {
        // User doesn't exist, create it
        console.log('Creating user record...');
        await this.createUserRecord();
      }
    } catch (error) {
      console.error('Error ensuring user exists:', error);
    }
  }

  // Ensure user is authenticated
  private async ensureUserAuthenticated() {
    if (!this.currentUserId) {
      await this.initializeAuth();
    }
    
    // Ensure user exists in database
    await this.ensureUserExists();
  }

  // Set user ID (for future authentication implementation)
  setUserId(userId: string | null) {
    this.currentUserId = userId;
  }
}

export const supabaseService = new SupabaseService();
