import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import AIAdviceDemo from '../components/AIAdviceDemo';
import AICoachBubble from '../components/AICoachBubble';
import APITestComponent from '../components/APITestComponent';
import CameraComponent from '../components/CameraComponent';
import CameraDebugComponent from '../components/CameraDebugComponent';
import CircularProgress from '../components/CircularProgress';
import FoodSelection from '../components/FoodSelection';
import MacroProgressBar from '../components/MacroProgressBar';
import NutritionDisplay from '../components/NutritionDisplay';
import SuggestionCard from '../components/SuggestionCard';
import TestCameraFlow from '../components/TestCameraFlow';
import { API_KEYS } from '../config/apiKeys';
import { aiCoachAgentService } from '../services/aiCoachAgentService';
import { AICoachAdvice, aiCoachService } from '../services/aiCoachService';
import { imageUploadService } from '../services/imageUploadService';
import { NutritionData, NutritionService } from '../services/nutritionService';
import { supabaseService } from '../services/supabaseService';
import { FoodDetection, VisionService } from '../services/visionService';

export default function DashboardScreen() {
  const router = useRouter();

  // Camera and nutrition analysis state
  const [showCamera, setShowCamera] = useState(false);
  const [showFoodSelection, setShowFoodSelection] = useState(false);
  const [showNutrition, setShowNutrition] = useState(false);
  const [detectedFoods, setDetectedFoods] = useState<FoodDetection[]>([]);
  const [selectedFood, setSelectedFood] = useState<FoodDetection | null>(null);
  const [nutritionData, setNutritionData] = useState<NutritionData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showTestFlow, setShowTestFlow] = useState(false);
  const [showAIDemo, setShowAIDemo] = useState(false);
  const [showAPITest, setShowAPITest] = useState(false);
  const [showCameraDebug, setShowCameraDebug] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<AICoachAdvice | null>(null);
  const [showAICoach, setShowAICoach] = useState(true);

  // Services
  const visionService = new VisionService(API_KEYS.GOOGLE_VISION_API_KEY);
  const nutritionService = new NutritionService(API_KEYS.NUTRITIONIX_APP_ID, API_KEYS.NUTRITIONIX_API_KEY);

  // Mock data for demonstration
  const calorieData = {
    consumed: 500,
    target: 2000,
    remaining: 1500,
  };

  const macroData = [
    { label: 'Carbs', current: 80, target: 200, unit: 'g', color: '#FF6B6B', icon: '🍞' },
    { label: 'Protein', current: 80, target: 200, unit: 'g', color: '#4ECDC4', icon: '🥩' },
    { label: 'Fats', current: 80, target: 200, unit: 'g', color: '#45B7D1', icon: '🥑' },
  ];

  const suggestions = [
    { icon: '🍽', title: 'Try these 3 simple low-carb recipes' },
    { icon: '🏋', title: 'Here are some simple at-home core workouts!!' },
  ];

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const currentDay = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
  const currentDayIndex = currentDay === 0 ? 6 : currentDay - 1; // Convert to Monday = 0

  // Camera and nutrition analysis handlers
  const handleTakePhoto = async (imageUri: string) => {
    setShowCamera(false);
    setIsProcessing(true);

    try {
      console.log('Processing image:', imageUri);

      // Step 1: Detect food items using Google Vision API
      const foods = await visionService.detectFood(imageUri);

      if (foods.length === 0) {
        Alert.alert('No Food Detected', 'We couldn\'t identify any food items in this image. Please try taking another photo with better lighting.');
        setIsProcessing(false);
        return;
      }

      if (foods.length === 1) {
        // If only one food detected, proceed directly
        setSelectedFood(foods[0]);
        await fetchNutritionData(foods[0]);
      } else {
        // If multiple foods detected, show selection screen
        setDetectedFoods(foods);
        setShowFoodSelection(true);
      }
    } catch (error) {
      console.error('Error processing image:', error);

      // Provide more specific error messages
      let errorMessage = 'Failed to analyze the image. Please try again.';

      if (error instanceof Error) {
        if (error.message.includes('File does not exist')) {
          errorMessage = 'Image file was not found. Please try taking the photo again.';
        } else if (error.message.includes('Vision API error')) {
          errorMessage = 'AI service is temporarily unavailable. Please try again later.';
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = 'Network error. Please check your internet connection and try again.';
        }
      }

      Alert.alert('Error', errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFoodSelect = async (food: FoodDetection) => {
    setShowFoodSelection(false);
    setSelectedFood(food);
    await fetchNutritionData(food);
  };

  const fetchNutritionData = async (food: FoodDetection) => {
    setIsProcessing(true);

    try {
      // Step 2: Get nutrition data using Nutritionix API
      const nutrition = await nutritionService.getNutritionData(food.food);

      if (!nutrition) {
        Alert.alert('Nutrition Data Not Found', `We couldn't find nutritional information for "${food.food}". Please try a different food item.`);
        setIsProcessing(false);
        return;
      }

      setNutritionData(nutrition);
      setShowNutrition(true);

      // Generate AI coach advice based on the food analysis
      const foodAnalysis = aiCoachService.analyzeFood(nutrition);
      const advice = aiCoachService.generateAdvice(foodAnalysis);
      setAiAdvice(advice);

      // Get AI Coach Agent feedback for the scanned food
      await handleScannedFoodAnalyzed(food.food, nutrition);
    } catch (error) {
      console.error('Error fetching nutrition data:', error);
      Alert.alert('Error', 'Failed to fetch nutrition information. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveNutrition = async () => {
    if (!nutritionData || !selectedFood) return;

    try {
      await supabaseService.saveNutritionEntry(
        selectedFood.food,
        nutritionData,
        undefined // imageUri - could be passed from camera if needed
      );

      Alert.alert('Saved!', `Nutrition data for "${selectedFood.food}" has been saved to your history.`);
      handleCloseNutrition();
    } catch (error) {
      console.error('Error saving nutrition data:', error);
      Alert.alert('Error', 'Failed to save nutrition data. Please try again.');
    }
  };

  const handleCloseNutrition = () => {
    setShowNutrition(false);
    setNutritionData(null);
    setSelectedFood(null);
    setDetectedFoods([]);
  };

  const handleCloseFoodSelection = () => {
    setShowFoodSelection(false);
    setDetectedFoods([]);
  };

  const handleAIAdviceGenerated = (advice: AICoachAdvice) => {
    setAiAdvice(advice);
  };

  const handleMealLogged = () => {
    // Refresh dashboard data when meal is logged via AI Coach
    console.log('Meal logged via AI Coach - refreshing dashboard');
    // You can add logic here to refresh the calorie data or other dashboard metrics
  };

  const handleScannedFoodAnalyzed = async (foodName: string, nutritionData: NutritionData, imageUri?: string) => {
    try {
      // Show AI Coach feedback for scanned food
      const response = await aiCoachAgentService.processScannedFood(foodName, nutritionData, imageUri);
      
      // You could show this in a modal or notification
      console.log('AI Coach feedback:', response.message);
      
      // Optionally show the AI Coach bubble with the feedback
      // You could trigger the AI Coach to show the feedback
      
    } catch (error) {
      console.error('Error getting AI Coach feedback for scanned food:', error);
    }
  };

  const handleGoalUpdated = () => {
    // Refresh dashboard data when goals are updated via AI Coach
    console.log('Goals updated via AI Coach - refreshing dashboard');
    // You can add logic here to refresh goal-related data
  };

  const toggleAICoach = () => {
    setShowAICoach(!showAICoach);
  };

  // Handle image upload from gallery
  const handleImageUpload = async () => {
    try {
      const imageResult = await imageUploadService.showImagePickerOptions();
      if (imageResult) {
        await handleTakePhoto(imageResult.uri);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'Failed to upload image. Please try again.');
    }
  };

  // Test function with a sample image
  const handleTestImage = async () => {
    try {
      // Use a test image data URL
      const testImageData = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8A';

      console.log('Testing with sample image...');
      await handleTakePhoto(testImageData);
    } catch (error) {
      console.error('Error with test image:', error);
      Alert.alert('Error', 'Test image failed. Please try camera or upload.');
    }
  };


  // Render camera, food selection, nutrition display, or test flow if active
  if (showCamera) {
    return <CameraComponent onPhotoTaken={handleTakePhoto} onClose={() => setShowCamera(false)} />;
  }

  if (showFoodSelection) {
    return <FoodSelection detectedFoods={detectedFoods} onFoodSelect={handleFoodSelect} onClose={handleCloseFoodSelection} />;
  }

  if (showNutrition && nutritionData) {
    return <NutritionDisplay nutritionData={nutritionData} onClose={handleCloseNutrition} onSave={handleSaveNutrition} />;
  }

  if (showTestFlow) {
    return <TestCameraFlow onClose={() => setShowTestFlow(false)} />;
  }

  if (showAIDemo) {
    return <AIAdviceDemo onClose={() => setShowAIDemo(false)} />;
  }

  if (showAPITest) {
    return <APITestComponent />;
  }

  if (showCameraDebug) {
    return <CameraDebugComponent onClose={() => setShowCameraDebug(false)} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F8F8" />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Ionicons name="calendar" size={20} color="#4ECDC4" />
              <Text style={styles.title}>Dashboard</Text>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity
                style={styles.debugButton}
                onPress={() => setShowCameraDebug(true)}
              >
                <Ionicons name="bug" size={16} color="#4ECDC4" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Day Selector */}
          <View style={styles.daySelector}>
            {days.map((day, index) => (
              <TouchableOpacity
                key={day}
                style={[
                  styles.dayButton,
                  index === currentDayIndex && styles.activeDayButton,
                ]}
              >
                <Text
                  style={[
                    styles.dayText,
                    index === currentDayIndex && styles.activeDayText,
                  ]}
                >
                  {day}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Main Circular Calorie Tracker */}
          <View style={styles.calorieSection}>
            <View style={styles.calorieTracker}>
              <CircularProgress
                size={200}
                strokeWidth={12}
                progress={calorieData.consumed / calorieData.target}
                color="#4ECDC4"
                backgroundColor="#E5E5E5"
              >
                <Text style={styles.calorieNumber}>{calorieData.remaining.toLocaleString()}</Text>
                <Text style={styles.calorieLabel}>CALS LEFT</Text>
              </CircularProgress>

              {/* Water and Steps Icons */}
              <View style={styles.sideIcons}>
                <View style={styles.sideIcon}>
                  <Ionicons name="water" size={24} color="#4ECDC4" />
                  <Text style={styles.sideIconText}>Water</Text>
                </View>
                <View style={styles.sideIcon}>
                  <Ionicons name="walk" size={24} color="#4ECDC4" />
                  <Text style={styles.sideIconText}>Steps</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Macro Nutrient Bars */}
          <View style={styles.macroSection}>
            <Text style={styles.sectionTitle}>Macro Nutrients</Text>
            <View style={styles.macroContainer}>
              {macroData.map((macro, index) => (
                <MacroProgressBar
                  key={index}
                  label={macro.label}
                  current={macro.current}
                  target={macro.target}
                  unit={macro.unit}
                  color={macro.color}
                  icon={macro.icon}
                />
              ))}
            </View>
          </View>

          {/* Notes Section */}
          <View style={styles.notesSection}>
            <View style={styles.notesHeader}>
              <Ionicons name="document-text" size={16} color="#666666" />
              <Text style={styles.notesTitle}>Notes</Text>
            </View>
            <TouchableOpacity style={styles.notesButton}>
              <Text style={styles.notesPlaceholder}>Add your daily notes...</Text>
              <Ionicons name="add" size={20} color="#4ECDC4" />
            </TouchableOpacity>
          </View>

          {/* Suggestions Section */}
          <View style={styles.suggestionsSection}>
            <Text style={styles.sectionTitle}>Suggestions</Text>
            {suggestions.map((suggestion, index) => (
              <SuggestionCard
                key={index}
                icon={suggestion.icon}
                title={suggestion.title}
                onPress={() => console.log('Suggestion pressed:', suggestion.title)}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Floating Camera Button */}
      <TouchableOpacity
        style={styles.floatingCameraButton}
        onPress={() => setShowCamera(true)}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <Ionicons name="camera" size={24} color="#FFFFFF" />
        )}
      </TouchableOpacity>

      {/* AI Coach Bubble */}
      {showAICoach && <AICoachBubble onMealLogged={handleMealLogged} onGoalUpdated={handleGoalUpdated} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginLeft: 8,
  },
  debugButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  daySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dayButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  activeDayButton: {
    backgroundColor: '#4ECDC4',
  },
  dayText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  activeDayText: {
    color: '#ffffff',
  },
  calorieSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  calorieTracker: {
    alignItems: 'center',
    position: 'relative',
  },
  calorieNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  calorieLabel: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '600',
  },
  sideIcons: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  sideIcon: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sideIconText: {
    fontSize: 12,
    color: '#4ECDC4',
    fontWeight: '600',
    marginTop: 4,
  },
  macroSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  macroContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notesSection: {
    marginBottom: 30,
  },
  notesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  notesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginLeft: 8,
  },
  notesButton: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notesPlaceholder: {
    fontSize: 16,
    color: '#999999',
  },
  suggestionsSection: {
    marginBottom: 20,
  },
  floatingCameraButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4ECDC4',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
