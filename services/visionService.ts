// Google Cloud Vision API service for food recognition
import * as FileSystem from 'expo-file-system/legacy';
import { Platform } from 'react-native';

export interface FoodDetection {
  food: string;
  confidence: number;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export class VisionService {
  private apiKey: string;
  private baseUrl = 'https://vision.googleapis.com/v1/images:annotate';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async detectFood(imageUri: string): Promise<FoodDetection[]> {
    try {
      console.log('Starting food detection for image:', imageUri);

      let base64Image: string;

      // Check if it's already a data URL (base64)
      if (imageUri.startsWith('data:')) {
        console.log('Image is already a data URL, extracting base64...');
        base64Image = imageUri.split(',')[1];
        console.log('Extracted base64 length:', base64Image.length);
      } else {
        // For file URIs, copy to permanent location first
        console.log('Image is a file URI, copying to permanent location...');
        const permanentUri = await this.copyImageToPermanentLocation(imageUri);
        console.log('Image copied to permanent location:', permanentUri);

        // Convert image to base64
        base64Image = await this.convertImageToBase64(permanentUri);
        console.log('Image converted to base64, length:', base64Image.length);
      }

      const requestBody = {
        requests: [
          {
            image: {
              content: base64Image,
            },
            features: [
              {
                type: 'LABEL_DETECTION',
                maxResults: 10,
              },
              {
                type: 'OBJECT_LOCALIZATION',
                maxResults: 10,
              },
            ],
          },
        ],
      };

      console.log('Sending request to Google Vision API...');
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Vision API error response:', errorText);
        throw new Error(`Vision API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Vision API response received:', JSON.stringify(data, null, 2));

      const detections = this.parseFoodDetections(data);
      console.log('Parsed detections:', detections);

      return detections;
    } catch (error) {
      console.error('Error detecting food:', error);
      throw new Error(`Failed to analyze food image: ${error.message}`);
    }
  }

  private async copyImageToPermanentLocation(tempUri: string): Promise<string> {
    try {
      console.log('Copying image from:', tempUri);
      console.log('Platform:', Platform.OS);

      // Check if source file exists
      const sourceInfo = await FileSystem.getInfoAsync(tempUri);
      if (!sourceInfo.exists) {
        console.log('Source file does not exist, using original URI');
        return tempUri;
      }

      // Create permanent path with better Android handling
      const fileName = `food_${Date.now()}.jpg`;
      let permanentPath: string;

      if (Platform.OS === 'android') {
        // Use cache directory for Android
        permanentPath = `${FileSystem.cacheDirectory}${fileName}`;
      } else {
        // Use document directory for iOS
        permanentPath = `${FileSystem.documentDirectory}${fileName}`;
      }

      console.log('Copying to permanent location:', permanentPath);

      // Copy the file
      await FileSystem.copyAsync({
        from: tempUri,
        to: permanentPath,
      });

      // Verify the copy
      const destInfo = await FileSystem.getInfoAsync(permanentPath);
      if (!destInfo.exists) {
        throw new Error('Copy operation failed');
      }

      console.log('Image successfully copied to permanent location');
      return permanentPath;
    } catch (error) {
      console.error('Error copying image:', error);
      console.log('Using original URI as fallback');
      return tempUri;
    }
  }

  private async convertImageToBase64(imageUri: string): Promise<string> {
    try {
      console.log('Converting image to base64:', imageUri);

      // For React Native, we need to read the file directly
      if (imageUri.startsWith('file://')) {
        // Remove the file:// prefix
        const filePath = imageUri.replace('file://', '');
        console.log('Reading local file:', filePath);

        // Use React Native's file system to read the file
        // Check if file exists
        const fileInfo = await FileSystem.getInfoAsync(filePath);
        if (!fileInfo.exists) {
          throw new Error(`File does not exist: ${filePath}`);
        }

        const base64 = await FileSystem.readAsStringAsync(filePath, {
          encoding: FileSystem.EncodingType.Base64,
        });

        console.log('Successfully read file as base64, length:', base64.length);
        return base64;
      } else if (!imageUri.startsWith('file://') && !imageUri.startsWith('http')) {
        // Handle paths without file:// prefix (like documentDirectory paths)
        console.log('Reading file without file:// prefix:', imageUri);

        // Check if file exists
        const fileInfo = await FileSystem.getInfoAsync(imageUri);
        if (!fileInfo.exists) {
          throw new Error(`File does not exist: ${imageUri}`);
        }

        const base64 = await FileSystem.readAsStringAsync(imageUri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        console.log('Successfully read file as base64, length:', base64.length);
        return base64;
      } else if (imageUri.startsWith('data:')) {
        // Handle data URLs (base64 encoded images)
        console.log('Processing data URL');
        const base64Data = imageUri.split(',')[1];
        console.log('Extracted base64 data, length:', base64Data.length);
        return base64Data;
      } else {
        // Handle web URLs (for testing)
        console.log('Fetching web URL:', imageUri);
        const response = await fetch(imageUri);
        const blob = await response.blob();

        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64 = reader.result as string;
            // Remove data:image/jpeg;base64, prefix
            const base64Data = base64.split(',')[1];
            resolve(base64Data);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      }
    } catch (error) {
      console.error('Error converting image to base64:', error);
      throw new Error(`Failed to process image: ${error.message}`);
    }
  }

  private parseFoodDetections(apiResponse: any): FoodDetection[] {
    const detections: FoodDetection[] = [];

    if (apiResponse.responses && apiResponse.responses[0]) {
      const response = apiResponse.responses[0];

      // Parse label detections
      if (response.labelAnnotations) {
        response.labelAnnotations.forEach((label: any) => {
          if (this.isFoodRelated(label.description)) {
            detections.push({
              food: label.description,
              confidence: label.score,
            });
          }
        });
      }

      // Parse object localizations
      if (response.localizedObjectAnnotations) {
        response.localizedObjectAnnotations.forEach((obj: any) => {
          if (this.isFoodRelated(obj.name)) {
            detections.push({
              food: obj.name,
              confidence: obj.score,
              boundingBox: obj.boundingPoly ? {
                x: obj.boundingPoly.normalizedVertices[0]?.x || 0,
                y: obj.boundingPoly.normalizedVertices[0]?.y || 0,
                width: (obj.boundingPoly.normalizedVertices[2]?.x || 0) - (obj.boundingPoly.normalizedVertices[0]?.x || 0),
                height: (obj.boundingPoly.normalizedVertices[2]?.y || 0) - (obj.boundingPoly.normalizedVertices[0]?.y || 0),
              } : undefined,
            });
          }
        });
      }
    }

    // Sort by confidence and remove duplicates
    const uniqueDetections = this.removeDuplicates(detections);
    return uniqueDetections.sort((a, b) => b.confidence - a.confidence);
  }

  private isFoodRelated(description: string): boolean {
    const foodKeywords = [
      'food', 'meal', 'dish', 'cuisine', 'cooking', 'recipe',
      'pizza', 'burger', 'sandwich', 'salad', 'pasta', 'rice',
      'chicken', 'beef', 'pork', 'fish', 'seafood', 'vegetable',
      'fruit', 'bread', 'cake', 'dessert', 'soup', 'stew',
      'breakfast', 'lunch', 'dinner', 'snack', 'appetizer',
      'main course', 'side dish', 'beverage', 'drink'
    ];

    const lowerDescription = description.toLowerCase();
    return foodKeywords.some(keyword => lowerDescription.includes(keyword));
  }

  private removeDuplicates(detections: FoodDetection[]): FoodDetection[] {
    const seen = new Set<string>();
    return detections.filter(detection => {
      const key = detection.food.toLowerCase();
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }
}
