// Enhanced user profile service with health conditions and goals
import { supabaseService, User } from './supabaseService';

export interface HealthCondition {
  id: string;
  name: string;
  type: 'chronic' | 'temporary' | 'allergy' | 'intolerance';
  severity: 'mild' | 'moderate' | 'severe';
  restrictions: string[];
  notes?: string;
}

export interface UserGoal {
  id: string;
  type: 'weight' | 'fitness' | 'nutrition' | 'health';
  target: string;
  targetValue?: number;
  currentValue?: number;
  deadline?: Date;
  isActive: boolean;
  notes?: string;
}

export interface EnhancedUserProfile extends User {
  healthConditions: HealthCondition[];
  goals: UserGoal[];
  dietaryRestrictions: string[];
  preferences: {
    mealReminders: boolean;
    coachMessages: boolean;
    weeklyReports: boolean;
    fastingReminders: boolean;
  };
}

export class UserProfileService {
  private static instance: UserProfileService;
  private currentProfile: EnhancedUserProfile | null = null;

  static getInstance(): UserProfileService {
    if (!UserProfileService.instance) {
      UserProfileService.instance = new UserProfileService();
    }
    return UserProfileService.instance;
  }

  async getCurrentProfile(): Promise<EnhancedUserProfile | null> {
    try {
      const user = await supabaseService.getCurrentUser();
      if (!user) return null;

      // Get health conditions
      const healthConditions = await this.getHealthConditions(user.id);
      
      // Get goals
      const goals = await this.getUserGoals(user.id);
      
      // Get dietary restrictions
      const dietaryRestrictions = await this.getDietaryRestrictions(user.id);
      
      // Get preferences
      const preferences = await this.getUserPreferences(user.id);

      this.currentProfile = {
        ...user,
        healthConditions,
        goals,
        dietaryRestrictions,
        preferences,
      };

      return this.currentProfile;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  async addHealthCondition(condition: Omit<HealthCondition, 'id'>): Promise<boolean> {
    try {
      const user = await supabaseService.getCurrentUser();
      if (!user) return false;

      const { error } = await supabaseService.supabase
        .from('health_conditions')
        .insert({
          user_id: user.id,
          ...condition,
        });

      if (error) {
        console.error('Error adding health condition:', error);
        return false;
      }

      // Refresh profile
      this.currentProfile = null;
      return true;
    } catch (error) {
      console.error('Error adding health condition:', error);
      return false;
    }
  }

  async updateHealthCondition(id: string, updates: Partial<HealthCondition>): Promise<boolean> {
    try {
      const { error } = await supabaseService.supabase
        .from('health_conditions')
        .update(updates)
        .eq('id', id);

      if (error) {
        console.error('Error updating health condition:', error);
        return false;
      }

      // Refresh profile
      this.currentProfile = null;
      return true;
    } catch (error) {
      console.error('Error updating health condition:', error);
      return false;
    }
  }

  async addUserGoal(goal: Omit<UserGoal, 'id'>): Promise<boolean> {
    try {
      const user = await supabaseService.getCurrentUser();
      if (!user) return false;

      const { error } = await supabaseService.supabase
        .from('user_goals')
        .insert({
          user_id: user.id,
          ...goal,
        });

      if (error) {
        console.error('Error adding user goal:', error);
        return false;
      }

      // Refresh profile
      this.currentProfile = null;
      return true;
    } catch (error) {
      console.error('Error adding user goal:', error);
      return false;
    }
  }

  async updateUserGoal(id: string, updates: Partial<UserGoal>): Promise<boolean> {
    try {
      const { error } = await supabaseService.supabase
        .from('user_goals')
        .update(updates)
        .eq('id', id);

      if (error) {
        console.error('Error updating user goal:', error);
        return false;
      }

      // Refresh profile
      this.currentProfile = null;
      return true;
    } catch (error) {
      console.error('Error updating user goal:', error);
      return false;
    }
  }

  async updateDietaryRestrictions(restrictions: string[]): Promise<boolean> {
    try {
      const user = await supabaseService.getCurrentUser();
      if (!user) return false;

      const { error } = await supabaseService.supabase
        .from('dietary_restrictions')
        .upsert({
          user_id: user.id,
          restrictions,
        });

      if (error) {
        console.error('Error updating dietary restrictions:', error);
        return false;
      }

      // Refresh profile
      this.currentProfile = null;
      return true;
    } catch (error) {
      console.error('Error updating dietary restrictions:', error);
      return false;
    }
  }

  private async getHealthConditions(userId: string): Promise<HealthCondition[]> {
    try {
      const { data, error } = await supabaseService.supabase
        .from('health_conditions')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        // If table doesn't exist, return empty array instead of logging error
        if (error.code === 'PGRST205') {
          console.log('Health conditions table not found, using empty array');
          return [];
        }
        console.error('Error fetching health conditions:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching health conditions:', error);
      return [];
    }
  }

  private async getUserGoals(userId: string): Promise<UserGoal[]> {
    try {
      const { data, error } = await supabaseService.supabase
        .from('user_goals')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true);

      if (error) {
        // If table doesn't exist, return empty array instead of logging error
        if (error.code === 'PGRST205') {
          console.log('User goals table not found, using empty array');
          return [];
        }
        console.error('Error fetching user goals:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching user goals:', error);
      return [];
    }
  }

  private async getDietaryRestrictions(userId: string): Promise<string[]> {
    try {
      // Check if table exists first, if not return empty array
      const { data, error } = await supabaseService.supabase
        .from('dietary_restrictions')
        .select('restrictions')
        .eq('user_id', userId)
        .single();

      if (error) {
        // If table doesn't exist, return empty array instead of logging error
        if (error.code === 'PGRST205') {
          console.log('Dietary restrictions table not found, using empty array');
          return [];
        }
        console.error('Error fetching dietary restrictions:', error);
        return [];
      }

      return data?.restrictions || [];
    } catch (error) {
      console.error('Error fetching dietary restrictions:', error);
      return [];
    }
  }

  private async getUserPreferences(userId: string) {
    try {
      const { data, error } = await supabaseService.supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching user preferences:', error);
        return {
          mealReminders: true,
          coachMessages: true,
          weeklyReports: true,
          fastingReminders: true,
        };
      }

      return {
        mealReminders: data?.meal_reminders ?? true,
        coachMessages: data?.coach_messages ?? true,
        weeklyReports: data?.weekly_reports ?? true,
        fastingReminders: data?.fasting_reminders ?? true,
      };
    } catch (error) {
      console.error('Error fetching user preferences:', error);
      return {
        mealReminders: true,
        coachMessages: true,
        weeklyReports: true,
        fastingReminders: true,
      };
    }
  }

  // Helper method to check if user has specific health condition
  hasHealthCondition(conditionName: string): boolean {
    return this.currentProfile?.healthConditions.some(
      condition => condition.name.toLowerCase().includes(conditionName.toLowerCase())
    ) ?? false;
  }

  // Helper method to get dietary restrictions for AI context
  getDietaryContext(): string {
    const conditions = this.currentProfile?.healthConditions || [];
    const restrictions = this.currentProfile?.dietaryRestrictions || [];
    
    const context = [];
    
    if (conditions.length > 0) {
      context.push(`Health conditions: ${conditions.map(c => c.name).join(', ')}`);
    }
    
    if (restrictions.length > 0) {
      context.push(`Dietary restrictions: ${restrictions.join(', ')}`);
    }
    
    return context.join('. ');
  }

  // Helper method to get goals context for AI
  getGoalsContext(): string {
    const goals = this.currentProfile?.goals || [];
    if (goals.length === 0) return 'No specific goals set';
    
    return `Current goals: ${goals.map(g => g.target).join(', ')}`;
  }
}

export const userProfileService = UserProfileService.getInstance();
