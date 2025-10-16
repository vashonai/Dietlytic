// Test component to verify API integration
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import { API_KEYS } from '../config/apiKeys';
import { NutritionService } from '../services/nutritionService';
import { VisionService } from '../services/visionService';

export default function APITestComponent() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const testNutritionAPI = async () => {
    setIsLoading(true);
    addResult('Testing Nutritionix API...');
    
    try {
      const nutritionService = new NutritionService(API_KEYS.NUTRITIONIX_APP_ID, API_KEYS.NUTRITIONIX_API_KEY);
      
      // Test with different foods
      const testFoods = ['apple', 'banana', 'chicken breast', 'pizza', 'salad'];
      
      for (const food of testFoods) {
        addResult(`Testing: ${food}`);
        const nutrition = await nutritionService.getNutritionData(food);
        
        if (nutrition) {
          addResult(`✅ ${food}: ${nutrition.nf_calories} cal, ${nutrition.nf_protein}g protein`);
        } else {
          addResult(`❌ ${food}: No data found`);
        }
      }
      
      addResult('Nutrition API test completed!');
    } catch (error) {
      addResult(`❌ Nutrition API error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testVisionAPI = async () => {
    setIsLoading(true);
    addResult('Testing Google Vision API...');
    
    try {
      const visionService = new VisionService(API_KEYS.GOOGLE_VISION_API_KEY);
      
      // Test with a sample image URL (you can replace this with a real image)
      const testImageUri = 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=400';
      
      addResult('Testing with sample food image...');
      const detections = await visionService.detectFood(testImageUri);
      
      if (detections.length > 0) {
        addResult(`✅ Found ${detections.length} food items:`);
        detections.forEach((detection, index) => {
          addResult(`  ${index + 1}. ${detection.food} (${Math.round(detection.confidence * 100)}%)`);
        });
      } else {
        addResult('❌ No food items detected');
      }
      
      addResult('Vision API test completed!');
    } catch (error) {
      addResult(`❌ Vision API error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testFullFlow = async () => {
    setIsLoading(true);
    addResult('Testing full camera to nutrition flow...');
    
    try {
      // Simulate the full flow
      const visionService = new VisionService(API_KEYS.GOOGLE_VISION_API_KEY);
      const nutritionService = new NutritionService(API_KEYS.NUTRITIONIX_APP_ID, API_KEYS.NUTRITIONIX_API_KEY);
      
      // Test with a sample image
      const testImageUri = 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=400';
      
      addResult('Step 1: Detecting food in image...');
      const detections = await visionService.detectFood(testImageUri);
      
      if (detections.length > 0) {
        const firstFood = detections[0];
        addResult(`Step 2: Found food: ${firstFood.food}`);
        
        addResult('Step 3: Getting nutrition data...');
        const nutrition = await nutritionService.getNutritionData(firstFood.food);
        
        if (nutrition) {
          addResult(`✅ SUCCESS! Dynamic nutrition data:`);
          addResult(`  Food: ${nutrition.food_name}`);
          addResult(`  Calories: ${nutrition.nf_calories}`);
          addResult(`  Protein: ${nutrition.nf_protein}g`);
          addResult(`  Carbs: ${nutrition.nf_total_carbohydrate}g`);
          addResult(`  Fat: ${nutrition.nf_total_fat}g`);
        } else {
          addResult('❌ Failed to get nutrition data');
        }
      } else {
        addResult('❌ No food detected in image');
      }
      
      addResult('Full flow test completed!');
    } catch (error) {
      addResult(`❌ Full flow error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>API Integration Test</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={testNutritionAPI}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Test Nutrition API</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={testVisionAPI}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Test Vision API</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.successButton]}
          onPress={testFullFlow}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Test Full Flow</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.clearButton]}
          onPress={clearResults}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Clear Results</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>Test Results:</Text>
        {testResults.map((result, index) => (
          <Text key={index} style={styles.resultText}>{result}</Text>
        ))}
        {isLoading && (
          <Text style={styles.loadingText}>🔄 Running tests...</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 12,
    marginBottom: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    backgroundColor: '#34C759',
  },
  successButton: {
    backgroundColor: '#FF9500',
  },
  clearButton: {
    backgroundColor: '#8E8E93',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  resultText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    fontFamily: 'monospace',
  },
  loadingText: {
    fontSize: 16,
    color: '#007AFF',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
  },
});
