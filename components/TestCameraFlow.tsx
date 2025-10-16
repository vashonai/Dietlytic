// Test component to verify camera to nutrition flow
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import { API_KEYS } from '../config/apiKeys';
import { imageUploadService } from '../services/imageUploadService';
import { NutritionService } from '../services/nutritionService';
import { VisionService } from '../services/visionService';

interface TestCameraFlowProps {
  onClose: () => void;
}

export default function TestCameraFlow({ onClose }: TestCameraFlowProps) {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const testImageUpload = async () => {
    try {
      addResult('Testing image upload...');
      const result = await imageUploadService.showImagePickerOptions();
      if (result) {
        addResult(`✅ Image upload successful: ${result.type} - ${result.uri.substring(0, 50)}...`);
        return result.uri;
      } else {
        addResult('❌ Image upload cancelled');
        return null;
      }
    } catch (error) {
      addResult(`❌ Image upload failed: ${error.message}`);
      return null;
    }
  };

  const testVisionAPI = async (imageUri: string) => {
    try {
      addResult('Testing Google Vision API...');
      const visionService = new VisionService(API_KEYS.GOOGLE_VISION_API_KEY);
      const detections = await visionService.detectFood(imageUri);
      
      if (detections.length > 0) {
        addResult(`✅ Vision API successful: Found ${detections.length} food items`);
        detections.forEach((detection, index) => {
          addResult(`  ${index + 1}. ${detection.food} (${Math.round(detection.confidence * 100)}%)`);
        });
        return detections[0]; // Return first detection for nutrition test
      } else {
        addResult('❌ Vision API: No food items detected');
        return null;
      }
    } catch (error) {
      addResult(`❌ Vision API failed: ${error.message}`);
      return null;
    }
  };

  const testNutritionAPI = async (foodDetection: any) => {
    try {
      addResult('Testing Nutritionix API...');
      const nutritionService = new NutritionService(API_KEYS.NUTRITIONIX_APP_ID, API_KEYS.NUTRITIONIX_API_KEY);
      const nutrition = await nutritionService.getNutritionData(foodDetection.food);
      
      if (nutrition) {
        addResult(`✅ Nutrition API successful: ${nutrition.food_name}`);
        addResult(`  Calories: ${nutrition.nf_calories}, Protein: ${nutrition.nf_protein}g, Carbs: ${nutrition.nf_total_carbohydrate}g`);
        return nutrition;
      } else {
        addResult('❌ Nutrition API: No nutrition data found');
        return null;
      }
    } catch (error) {
      addResult(`❌ Nutrition API failed: ${error.message}`);
      return null;
    }
  };

  const runFullTest = async () => {
    setIsRunning(true);
    clearResults();
    addResult('🚀 Starting full camera to nutrition flow test...');

    try {
      // Step 1: Test image upload
      const imageUri = await testImageUpload();
      if (!imageUri) {
        addResult('❌ Test failed at image upload step');
        setIsRunning(false);
        return;
      }

      // Step 2: Test Vision API
      const foodDetection = await testVisionAPI(imageUri);
      if (!foodDetection) {
        addResult('❌ Test failed at Vision API step');
        setIsRunning(false);
        return;
      }

      // Step 3: Test Nutrition API
      const nutrition = await testNutritionAPI(foodDetection);
      if (!nutrition) {
        addResult('❌ Test failed at Nutrition API step');
        setIsRunning(false);
        return;
      }

      addResult('🎉 Full test completed successfully!');
      addResult(`Final result: ${nutrition.food_name} - ${nutrition.nf_calories} calories`);

    } catch (error) {
      addResult(`❌ Test failed with error: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const testAPIConnectivity = async () => {
    setIsRunning(true);
    clearResults();
    addResult('🔍 Testing API connectivity...');

    try {
      // Test Google Vision API
      addResult('Testing Google Vision API connectivity...');
      const visionResponse = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${API_KEYS.GOOGLE_VISION_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requests: [{ image: { content: 'test' }, features: [{ type: 'LABEL_DETECTION', maxResults: 1 }] }]
        })
      });
      
      if (visionResponse.status === 400) {
        addResult('✅ Google Vision API: Connected (400 expected for test data)');
      } else {
        addResult(`⚠️ Google Vision API: Status ${visionResponse.status}`);
      }

      // Test Nutritionix API
      addResult('Testing Nutritionix API connectivity...');
      const nutritionResponse = await fetch('https://trackapi.nutritionix.com/v2/search/instant?query=apple', {
        headers: {
          'x-app-id': API_KEYS.NUTRITIONIX_APP_ID,
          'x-app-key': API_KEYS.NUTRITIONIX_API_KEY,
        }
      });

      if (nutritionResponse.ok) {
        addResult('✅ Nutritionix API: Connected successfully');
      } else {
        addResult(`❌ Nutritionix API: Status ${nutritionResponse.status}`);
      }

    } catch (error) {
      addResult(`❌ Connectivity test failed: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Camera Flow Test</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.testButton, styles.primaryButton]}
            onPress={runFullTest}
            disabled={isRunning}
          >
            <Ionicons name="camera" size={20} color="white" />
            <Text style={styles.buttonText}>Run Full Test</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.testButton, styles.secondaryButton]}
            onPress={testAPIConnectivity}
            disabled={isRunning}
          >
            <Ionicons name="wifi" size={20} color="#007AFF" />
            <Text style={styles.secondaryButtonText}>Test API Connectivity</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.testButton, styles.clearButton]}
            onPress={clearResults}
            disabled={isRunning}
          >
            <Ionicons name="trash" size={20} color="#666" />
            <Text style={styles.clearButtonText}>Clear Results</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>Test Results:</Text>
          {testResults.map((result, index) => (
            <Text key={index} style={styles.resultText}>{result}</Text>
          ))}
          {isRunning && (
            <Text style={styles.runningText}>🔄 Running tests...</Text>
          )}
        </View>
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
  buttonContainer: {
    gap: 12,
    marginBottom: 20,
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    backgroundColor: '#f0f8ff',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  clearButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  clearButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  resultsContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    minHeight: 200,
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
  runningText: {
    fontSize: 16,
    color: '#007AFF',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
  },
});
