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
      console.log('Fetching nutrition data for:', foodName);
      
      // Try the original food name first
      let nutritionData = await this.tryGetNutritionData(foodName);
      
      // If that fails, try alternative search terms
      if (!nutritionData) {
        console.log('Original search failed, trying alternative terms...');
        
        const alternatives = this.generateAlternativeSearchTerms(foodName);
        
        for (const alternative of alternatives) {
          console.log('Trying alternative term:', alternative);
          nutritionData = await this.tryGetNutritionData(alternative);
          if (nutritionData) {
            console.log('Found nutrition data with alternative term:', alternative);
            break;
          }
        }
      }
      
      if (!nutritionData) {
        console.log('No nutrition data found for any search term');
        return null;
      }
      
      return nutritionData;
    } catch (error) {
      console.error('Error fetching nutrition data:', error);
      throw new Error(`Failed to fetch nutrition information: ${error.message}`);
    }
  }

  private async tryGetNutritionData(foodName: string): Promise<NutritionData | null> {
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
        if (response.status === 404) {
          console.log(`No match found for: ${foodName}`);
          return null;
        }
        const errorText = await response.text();
        console.error('Nutrition API error response:', errorText);
        throw new Error(`Nutrition API error: ${response.status} - ${errorText}`);
      }

      const data: NutritionResponse = await response.json();
      
      if (data.foods && data.foods.length > 0) {
        console.log('Found nutrition data for:', data.foods[0].food_name);
        return data.foods[0];
      }
      
      return null;
    } catch (error) {
      console.error(`Error trying nutrition data for ${foodName}:`, error);
      return null;
    }
  }

  private generateAlternativeSearchTerms(originalTerm: string): string[] {
    const alternatives: string[] = [];
    const lowerTerm = originalTerm.toLowerCase();
    
    // Common food mapping for generic terms
    const foodMappings: { [key: string]: string[] } = {
      'snack': ['potato chips', 'crackers', 'nuts'],
      'food': ['bread', 'sandwich', 'meal'],
      'package': ['potato chips', 'crackers', 'snack'],
      'bag': ['potato chips', 'popcorn', 'nuts'],
      'container': ['yogurt', 'milk', 'juice'],
      'bottle': ['water', 'soda', 'juice'],
      'box': ['cereal', 'crackers', 'pasta'],
      'chips': ['potato chips', 'tortilla chips', 'corn chips'],
      'snacks': ['potato chips', 'crackers', 'nuts'],
      'crackers': ['saltine crackers', 'wheat crackers', 'cheese crackers'],
      'nuts': ['almonds', 'peanuts', 'cashews'],
      'fruit': ['apple', 'banana', 'orange'],
      'vegetable': ['carrot', 'broccoli', 'lettuce'],
      'meat': ['chicken', 'beef', 'pork'],
      'bread': ['white bread', 'wheat bread', 'whole grain bread'],
    };
    
    // Add direct mappings
    if (foodMappings[lowerTerm]) {
      alternatives.push(...foodMappings[lowerTerm]);
    }
    
    // Add generic alternatives
    alternatives.push('generic food', 'mixed food', 'processed food');
    
    // Add the original term with common food words
    alternatives.push(`${lowerTerm} snack`, `${lowerTerm} food`, `processed ${lowerTerm}`);
    
    return alternatives.slice(0, 5); // Limit to 5 alternatives to avoid too many API calls
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
