// Google Cloud Vision API service for food recognition
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
      // Convert image to base64
      const base64Image = await this.convertImageToBase64(imageUri);
      
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

      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Vision API error: ${response.status}`);
      }

      const data = await response.json();
      return this.parseFoodDetections(data);
    } catch (error) {
      console.error('Error detecting food:', error);
      throw new Error('Failed to analyze food image');
    }
  }

  private async convertImageToBase64(imageUri: string): Promise<string> {
    try {
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
    } catch (error) {
      console.error('Error converting image to base64:', error);
      throw new Error('Failed to process image');
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
