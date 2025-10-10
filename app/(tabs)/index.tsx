import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import CameraComponent from '@/components/CameraComponent';
import FoodSelection from '@/components/FoodSelection';
import NutritionDisplay from '@/components/NutritionDisplay';
import { VisionService, FoodDetection } from '@/services/visionService';
import { NutritionService, NutritionData } from '@/services/nutritionService';
import { firebaseService } from '@/services/firebaseService';
import { API_KEYS } from '@/config/apiKeys';

export default function HomeScreen() {
  const [showCamera, setShowCamera] = useState(false);
  const [showFoodSelection, setShowFoodSelection] = useState(false);
  const [showNutrition, setShowNutrition] = useState(false);
  const [detectedFoods, setDetectedFoods] = useState<FoodDetection[]>([]);
  const [selectedFood, setSelectedFood] = useState<FoodDetection | null>(null);
  const [nutritionData, setNutritionData] = useState<NutritionData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const visionService = new VisionService(API_KEYS.GOOGLE_VISION_API_KEY);
  const nutritionService = new NutritionService(API_KEYS.NUTRITIONIX_APP_ID, API_KEYS.NUTRITIONIX_API_KEY);

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
      await firebaseService.saveNutritionEntry({
        foodName: selectedFood.food,
        nutritionData: nutritionData,
      });
      
      Alert.alert('Saved!', 'Nutrition data has been saved to your history.');
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

  if (showCamera) {
    return <CameraComponent onPhotoTaken={handleTakePhoto} onClose={() => setShowCamera(false)} />;
  }

  if (showFoodSelection) {
    return <FoodSelection detectedFoods={detectedFoods} onFoodSelect={handleFoodSelect} onClose={handleCloseFoodSelection} />;
  }

  if (showNutrition && nutritionData) {
    return <NutritionDisplay nutritionData={nutritionData} onClose={handleCloseNutrition} onSave={handleSaveNutrition} />;
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>Dietlytic</ThemedText>
        <ThemedText style={styles.subtitle}>AI Nutrition Assistant</ThemedText>
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="camera" size={80} color="#007AFF" />
        </View>

        <ThemedText style={styles.description}>
          Take a photo of your meal and get instant nutritional analysis powered by AI
        </ThemedText>

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
              <ThemedText style={styles.cameraButtonText}>Take Photo</ThemedText>
            </>
          )}
        </TouchableOpacity>

        <View style={styles.features}>
          <View style={styles.feature}>
            <Ionicons name="eye" size={24} color="#007AFF" />
            <ThemedText style={styles.featureText}>AI Food Recognition</ThemedText>
          </View>
          <View style={styles.feature}>
            <Ionicons name="analytics" size={24} color="#007AFF" />
            <ThemedText style={styles.featureText}>Detailed Nutrition Info</ThemedText>
          </View>
          <View style={styles.feature}>
            <Ionicons name="save" size={24} color="#007AFF" />
            <ThemedText style={styles.featureText}>Save to History</ThemedText>
          </View>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 30,
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    color: '#666',
    marginBottom: 40,
    lineHeight: 24,
  },
  cameraButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    marginBottom: 40,
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
  features: {
    width: '100%',
    gap: 20,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  featureText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 16,
    color: '#333',
  },
});
