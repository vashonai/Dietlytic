// Google Cloud Vision API service for food recognition
import * as FileSystem from 'expo-file-system/legacy';

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
      
      // Convert image to base64
      const base64Image = await this.convertImageToBase64(imageUri);
      console.log('Image converted to base64, length:', base64Image.length);
      
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
