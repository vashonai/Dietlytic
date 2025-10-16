// Demo component to showcase AI coach advice
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { AICoachAdvice, aiCoachService, UserGoals } from '../services/aiCoachService';
import { NutritionData } from '../services/nutritionService';

interface AIAdviceDemoProps {
  onClose: () => void;
}

export default function AIAdviceDemo({ onClose }: AIAdviceDemoProps) {
  const [currentAdvice, setCurrentAdvice] = useState<AICoachAdvice | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Sample nutrition data for different foods
  const sampleFoods = [
    {
      name: 'Apple',
      nutrition: {
        food_name: 'Apple',
        serving_unit: 'medium',
        serving_weight_grams: 182,
        nf_calories: 95,
        nf_total_fat: 0.3,
        nf_saturated_fat: 0.1,
        nf_cholesterol: 0,
        nf_sodium: 2,
        nf_total_carbohydrate: 25,
        nf_dietary_fiber: 4.4,
        nf_sugars: 19,
        nf_protein: 0.5,
        nf_potassium: 195,
        nf_vitamin_c: 8.4,
        nf_calcium: 11,
        nf_iron: 0.2,
      } as NutritionData
    },
    {
      name: 'Potato Chips',
      nutrition: {
        food_name: 'Potato Chips',
        serving_unit: 'bag',
        serving_weight_grams: 28,
        nf_calories: 152,
        nf_total_fat: 10,
        nf_saturated_fat: 3,
        nf_cholesterol: 0,
        nf_sodium: 170,
        nf_total_carbohydrate: 15,
        nf_dietary_fiber: 1,
        nf_sugars: 0.2,
        nf_protein: 2,
        nf_potassium: 330,
        nf_vitamin_c: 0,
        nf_calcium: 0,
        nf_iron: 0.3,
      } as NutritionData
    },
    {
      name: 'Grilled Chicken',
      nutrition: {
        food_name: 'Grilled Chicken Breast',
        serving_unit: '100g',
        serving_weight_grams: 100,
        nf_calories: 165,
        nf_total_fat: 3.6,
        nf_saturated_fat: 1.0,
        nf_cholesterol: 85,
        nf_sodium: 74,
        nf_total_carbohydrate: 0,
        nf_dietary_fiber: 0,
        nf_sugars: 0,
        nf_protein: 31,
        nf_potassium: 256,
        nf_vitamin_c: 0,
        nf_calcium: 15,
        nf_iron: 1.0,
      } as NutritionData
    }
  ];

  const analyzeFood = async (food: typeof sampleFoods[0]) => {
    setIsAnalyzing(true);
    
    // Simulate analysis delay
    setTimeout(() => {
      const foodAnalysis = aiCoachService.analyzeFood(food.nutrition);
      const advice = aiCoachService.generateAdvice(foodAnalysis);
      setCurrentAdvice(advice);
      setIsAnalyzing(false);
    }, 1000);
  };

  const setUserGoal = (goal: 'lose' | 'maintain' | 'gain') => {
    const userGoals: UserGoals = {
      weightGoal: goal,
      activityLevel: 'moderate',
      dietaryRestrictions: [],
      healthConditions: [],
    };
    aiCoachService.setUserGoals(userGoals);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AI Coach Demo</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Set Your Goal</Text>
          <View style={styles.goalButtons}>
            {['lose', 'maintain', 'gain'].map((goal) => (
              <TouchableOpacity
                key={goal}
                style={styles.goalButton}
                onPress={() => setUserGoal(goal as any)}
              >
                <Text style={styles.goalButtonText}>
                  {goal.charAt(0).toUpperCase() + goal.slice(1)} Weight
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Try Different Foods</Text>
          <Text style={styles.sectionSubtitle}>
            Tap a food to see how the AI coach responds based on your goals
          </Text>
          
          {sampleFoods.map((food, index) => (
            <TouchableOpacity
              key={index}
              style={styles.foodButton}
              onPress={() => analyzeFood(food)}
              disabled={isAnalyzing}
            >
              <Text style={styles.foodButtonText}>{food.name}</Text>
              <Ionicons name="chevron-forward" size={20} color="#007AFF" />
            </TouchableOpacity>
          ))}
        </View>

        {isAnalyzing && (
          <View style={styles.analyzingContainer}>
            <Text style={styles.analyzingText}>🤖 AI Coach is analyzing...</Text>
          </View>
        )}

        {currentAdvice && (
          <View style={styles.adviceContainer}>
            <Text style={styles.adviceTitle}>AI Coach Advice:</Text>
            <View style={[
              styles.adviceCard,
              currentAdvice.type === 'positive' && styles.adviceCardPositive,
              currentAdvice.type === 'warning' && styles.adviceCardWarning,
              currentAdvice.type === 'suggestion' && styles.adviceCardSuggestion,
            ]}>
              <Text style={styles.adviceMessage}>{currentAdvice.message}</Text>
              
              {currentAdvice.actionItems.length > 0 && (
                <View style={styles.actionItemsContainer}>
                  <Text style={styles.actionItemsTitle}>Action Items:</Text>
                  {currentAdvice.actionItems.map((item, index) => (
                    <Text key={index} style={styles.actionItem}>• {item}</Text>
                  ))}
                </View>
              )}

              {currentAdvice.relatedTips.length > 0 && (
                <View style={styles.tipsContainer}>
                  <Text style={styles.tipsTitle}>Related Tips:</Text>
                  {currentAdvice.relatedTips.map((tip, index) => (
                    <Text key={index} style={styles.tip}>💡 {tip}</Text>
                  ))}
                </View>
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  goalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  goalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
    alignItems: 'center',
  },
  goalButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  foodButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  foodButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  analyzingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  analyzingText: {
    fontSize: 16,
    color: '#007AFF',
    fontStyle: 'italic',
  },
  adviceContainer: {
    marginTop: 20,
  },
  adviceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  adviceCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  adviceCardPositive: {
    backgroundColor: '#f0f9ff',
    borderColor: '#10b981',
  },
  adviceCardWarning: {
    backgroundColor: '#fef2f2',
    borderColor: '#ef4444',
  },
  adviceCardSuggestion: {
    backgroundColor: '#fffbeb',
    borderColor: '#f59e0b',
  },
  adviceMessage: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 12,
  },
  actionItemsContainer: {
    marginBottom: 12,
  },
  actionItemsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 6,
  },
  actionItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
    paddingLeft: 8,
  },
  tipsContainer: {
    marginBottom: 12,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 6,
  },
  tip: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
    paddingLeft: 8,
  },
});
