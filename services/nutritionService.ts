// Nutritionix API service for nutritional data
export interface NutritionData {
  food_name: string;
  serving_unit: string;
  serving_weight_grams: number;
  nf_calories: number;
  nf_total_fat: number;
  nf_saturated_fat: number;
  nf_cholesterol: number;
  nf_sodium: number;
  nf_total_carbohydrate: number;
  nf_dietary_fiber: number;
  nf_sugars: number;
  nf_protein: number;
  nf_potassium: number;
  nf_vitamin_c: number;
  nf_calcium: number;
  nf_iron: number;
}

export interface NutritionResponse {
  foods: NutritionData[];
}

export class NutritionService {
  private appId: string;
  private appKey: string;
  private baseUrl = 'https://trackapi.nutritionix.com/v2';

  constructor(appId: string, appKey: string) {
    this.appId = appId;
    this.appKey = appKey;
  }

  async getNutritionData(foodName: string): Promise<NutritionData | null> {
    try {
      const response = await fetch(`${this.baseUrl}/natural/nutrients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-app-id': this.appId,
          'x-app-key': this.appKey,
        },
        body: JSON.stringify({
          query: foodName,
        }),
      });

      if (!response.ok) {
        throw new Error(`Nutrition API error: ${response.status}`);
      }

      const data: NutritionResponse = await response.json();
      
      if (data.foods && data.foods.length > 0) {
        return data.foods[0];
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching nutrition data:', error);
      throw new Error('Failed to fetch nutrition information');
    }
  }

  async searchFoods(query: string): Promise<NutritionData[]> {
    try {
      const response = await fetch(`${this.baseUrl}/search/instant?query=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: {
          'x-app-id': this.appId,
          'x-app-key': this.appKey,
        },
      });

      if (!response.ok) {
        throw new Error(`Nutrition API error: ${response.status}`);
      }

      const data = await response.json();
      return data.common || [];
    } catch (error) {
      console.error('Error searching foods:', error);
      throw new Error('Failed to search foods');
    }
  }
}
