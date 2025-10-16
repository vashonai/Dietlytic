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
import FoodSelection from '../components/FoodSelection';
import NutritionDisplay from '../components/NutritionDisplay';
import TestCameraFlow from '../components/TestCameraFlow';
import { API_KEYS } from '../config/apiKeys';
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
  const [aiAdvice, setAiAdvice] = useState<AICoachAdvice | null>(null);
  const [showAICoach, setShowAICoach] = useState(true);

  // Services
  const visionService = new VisionService(API_KEYS.GOOGLE_VISION_API_KEY);
  const nutritionService = new NutritionService(API_KEYS.NUTRITIONIX_APP_ID, API_KEYS.NUTRITIONIX_API_KEY);

  // Mock data for demonstration
  const calorieData = {
    consumed: 1200,
    target: 2000,
    remaining: 800,
  };

  const nutrientData = [
    { name: 'Carbs', consumed: 45, target: 50, color: '#FF6B6B' },
    { name: 'Protein', consumed: 35, target: 30, color: '#4ECDC4' },
    { name: 'Fats', consumed: 20, target: 20, color: '#45B7D1' },
  ];

  const tips = [
    'Try these 3 simple low-carb recipes',
    'Drink more water throughout the day',
    'Add more vegetables to your meals',
  ];

  // Camera and nutrition analysis handlers
  const handleTakePhoto = async (imageUri: string) => {
    setShowCamera(false);
    setIsProcessing(true);

    try {
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
      Alert.alert('Error', 'Failed to analyze the image. Please try again.');
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

  const renderNutrientBar = (nutrient: any) => (
    <View key={nutrient.name} style={styles.nutrientItem}>
      <View style={styles.nutrientHeader}>
        <Text style={styles.nutrientName}>{nutrient.name}</Text>
        <Text style={styles.nutrientValue}>
          {nutrient.consumed}g / {nutrient.target}g
        </Text>
      </View>
      <View style={styles.nutrientBarContainer}>
        <View
          style={[
            styles.nutrientBar,
            {
              width: `${(nutrient.consumed / nutrient.target) * 100}%`,
              backgroundColor: nutrient.color,
            },
          ]}
        />
      </View>
    </View>
  );

  const renderTip = (tip: string, index: number) => (
    <TouchableOpacity key={index} style={styles.tipCard}>
      <Text style={styles.tipText}>{tip}</Text>
      <Text style={styles.tipArrow}>›</Text>
    </TouchableOpacity>
  );

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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>DASHBOARD</Text>
            <View style={styles.headerRight}>
              <TouchableOpacity
                style={styles.testButton}
                onPress={() => setShowTestFlow(true)}
              >
                <Ionicons name="bug" size={16} color="#007AFF" />
                <Text style={styles.testButtonText}>Test</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.demoButton}
                onPress={() => setShowAIDemo(true)}
              >
                <Ionicons name="bulb" size={16} color="#007AFF" />
                <Text style={styles.demoButtonText}>AI Demo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.aiToggleButton}
                onPress={toggleAICoach}
              >
                <Ionicons name={showAICoach ? "eye-off" : "eye"} size={16} color="#007AFF" />
                <Text style={styles.aiToggleText}>{showAICoach ? "Hide" : "Show"} AI</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.apiTestButton}
                onPress={() => setShowAPITest(true)}
              >
                <Ionicons name="flask" size={16} color="#007AFF" />
                <Text style={styles.apiTestText}>API Test</Text>
              </TouchableOpacity>
              <View style={styles.calendarContainer}>
                <Text style={styles.calendarText}>Mon - Sun</Text>
              </View>
            </View>
          </View>

          {/* Main Camera Feature */}
          <View style={styles.cameraSection}>
            <View style={styles.cameraCard}>
              <View style={styles.cameraIconContainer}>
                <Ionicons name="camera" size={60} color="#007AFF" />
              </View>
              <Text style={styles.cameraTitle}>Scan Your Food</Text>
              <Text style={styles.cameraSubtitle}>
                Take a photo of your meal to get instant nutritional analysis powered by AI
              </Text>
              <View style={styles.cameraButtonsContainer}>
                <TouchableOpacity 
                  style={[styles.cameraButton, isProcessing && styles.cameraButtonDisabled]} 
                  onPress={() => setShowCamera(true)}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <ActivityIndicator color="white" size="large" />
                  ) : (
                    <>
                      <Ionicons name="camera" size={24} color="white" />
                      <Text style={styles.cameraButtonText}>Take Photo</Text>
                    </>
                  )}
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.uploadButton, isProcessing && styles.uploadButtonDisabled]} 
                  onPress={handleImageUpload}
                  disabled={isProcessing}
                >
                  <Ionicons name="images" size={20} color="#007AFF" />
                  <Text style={styles.uploadButtonText}>Upload Image</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Calorie Counter */}
          <View style={styles.calorieSection}>
            <View style={styles.calorieCard}>
              <Text style={styles.calorieRemaining}>{calorieData.remaining}</Text>
              <Text style={styles.calorieLabel}>CALS LEFT</Text>
              <View style={styles.calorieProgress}>
                <View
                  style={[
                    styles.calorieProgressBar,
                    {
                      width: `${(calorieData.consumed / calorieData.target) * 100}%`,
                    },
                  ]}
                />
              </View>
              <Text style={styles.calorieDetails}>
                {calorieData.consumed} of {calorieData.target} calories consumed
              </Text>
            </View>
          </View>

          {/* Nutrient Bars */}
          <View style={styles.nutrientSection}>
            <Text style={styles.sectionTitle}>Today's Nutrition</Text>
            <View style={styles.nutrientContainer}>
              {nutrientData.map(renderNutrientBar)}
            </View>
          </View>

          {/* Tips Section */}
          <View style={styles.tipsSection}>
            <Text style={styles.sectionTitle}>Health Tips</Text>
            <View style={styles.tipsContainer}>
              {tips.map(renderTip)}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowCamera(true)}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <ActivityIndicator color="white" size="large" />
        ) : (
          <Ionicons name="camera" size={28} color="white" />
        )}
      </TouchableOpacity>

      {/* Bottom Tab Navigation */}
      <View style={styles.bottomTabs}>
        <TouchableOpacity
          style={[styles.tabItem, styles.activeTab]}
          onPress={() => router.push('/(tabs)')}
        >
          <Text style={styles.tabIcon}>📊</Text>
          <Text style={[styles.tabLabel, styles.activeTabLabel]}>Dashboard</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.push('/(tabs)/food-history')}
        >
          <Text style={styles.tabIcon}>📝</Text>
          <Text style={styles.tabLabel}>History</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.push('/(tabs)/profile')}
        >
          <Text style={styles.tabIcon}>👤</Text>
          <Text style={styles.tabLabel}>Profile</Text>
        </TouchableOpacity>
      </View>

      {/* AI Coach Bubble */}
      {showAICoach && <AICoachBubble onAdviceGenerated={handleAIAdviceGenerated} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#f0f8ff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  testButtonText: {
    color: '#007AFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  demoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#f0f8ff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  demoButtonText: {
    color: '#007AFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  aiToggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#f0f8ff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  aiToggleText: {
    color: '#007AFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  apiTestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#f0f8ff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  apiTestText: {
    color: '#007AFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  calendarContainer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  calendarText: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
  cameraSection: {
    marginBottom: 24,
  },
  cameraCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cameraIconContainer: {
    marginBottom: 16,
  },
  cameraTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
  },
  cameraSubtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  cameraButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cameraButtonDisabled: {
    backgroundColor: '#ccc',
  },
  cameraButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  cameraButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  uploadButton: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    flex: 1,
  },
  uploadButtonDisabled: {
    backgroundColor: '#f0f0f0',
    borderColor: '#ccc',
  },
  uploadButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  calorieSection: {
    marginBottom: 24,
  },
  calorieCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  calorieRemaining: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  calorieLabel: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 16,
    fontWeight: '500',
  },
  calorieProgress: {
    width: '100%',
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginBottom: 12,
  },
  calorieProgressBar: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  calorieDetails: {
    fontSize: 14,
    color: '#666666',
  },
  nutrientSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  nutrientContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  nutrientItem: {
    marginBottom: 16,
  },
  nutrientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  nutrientName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  nutrientValue: {
    fontSize: 14,
    color: '#666666',
  },
  nutrientBarContainer: {
    width: '100%',
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
  },
  nutrientBar: {
    height: '100%',
    borderRadius: 3,
  },
  tipsSection: {
    marginBottom: 20,
  },
  tipsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tipText: {
    flex: 1,
    fontSize: 16,
    color: '#1a1a1a',
    marginRight: 12,
  },
  tipArrow: {
    fontSize: 20,
    color: '#cccccc',
  },
  bottomTabs: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeTab: {
    backgroundColor: '#f0f8ff',
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 12,
    color: '#666666',
  },
  activeTabLabel: {
    color: '#007AFF',
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
