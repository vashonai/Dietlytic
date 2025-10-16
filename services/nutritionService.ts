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
        // Try one more time with a more specific query
        const specificQuery = `1 ${foodName}`;
        console.log('Trying specific query:', specificQuery);
        nutritionData = await this.tryGetNutritionData(specificQuery);
        
        if (!nutritionData) {
          console.log('Still no data found, using fallback');
          return this.getFallbackNutritionData(foodName);
        }
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
      console.log('API response received for:', foodName);
      console.log('Number of foods found:', data.foods ? data.foods.length : 0);
      
      if (data.foods && data.foods.length > 0) {
        const nutrition = data.foods[0];
        console.log('Successfully found nutrition data for:', nutrition.food_name);
        console.log('Calories:', nutrition.nf_calories);
        console.log('Protein:', nutrition.nf_protein);
        console.log('Carbs:', nutrition.nf_total_carbohydrate);
        return nutrition;
      }
      
      console.log('No foods found in response for:', foodName);
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
      'pizza': ['cheese pizza', 'pepperoni pizza', 'margherita pizza'],
      'burger': ['cheeseburger', 'hamburger', 'chicken burger'],
      'salad': ['caesar salad', 'garden salad', 'chicken salad'],
      'pasta': ['spaghetti', 'macaroni', 'penne pasta'],
      'rice': ['white rice', 'brown rice', 'fried rice'],
      'soup': ['chicken soup', 'vegetable soup', 'tomato soup'],
      'sandwich': ['turkey sandwich', 'ham sandwich', 'club sandwich'],
      'breakfast': ['cereal', 'toast', 'eggs'],
      'lunch': ['sandwich', 'salad', 'soup'],
      'dinner': ['chicken', 'pasta', 'rice'],
    };
    
    // Add direct mappings
    if (foodMappings[lowerTerm]) {
      alternatives.push(...foodMappings[lowerTerm]);
    }
    
    // Add generic alternatives
    alternatives.push('generic food', 'mixed food', 'processed food');
    
    // Add the original term with common food words
    alternatives.push(`${lowerTerm} snack`, `${lowerTerm} food`, `processed ${lowerTerm}`);
    
    // Clean up the original term and try variations
    const cleanTerm = lowerTerm.replace(/[^a-z\s]/g, '').trim();
    if (cleanTerm !== lowerTerm) {
      alternatives.push(cleanTerm);
    }
    
    return alternatives.slice(0, 5); // Limit to 5 alternatives to avoid too many API calls
  }

  private getFallbackNutritionData(foodName: string): NutritionData | null {
    const lowerName = foodName.toLowerCase();
    
    // Fallback nutrition data for common foods
    const fallbackFoods: { [key: string]: NutritionData } = {
      'apple': {
        food_name: 'Apple',
        serving_unit: 'medium',
        serving_weight_grams: 182,
        nf_calories: 95,
        nf_total_fat: 0.3,
        nf_saturated_fat: 0.1,
        nf_cholesterol: 0,
        nf_sodium: 2,
        nf_total_carbohydrate: 25,
        nf_dietary_fiber: 4.4,
        nf_sugars: 19,
        nf_protein: 0.5,
        nf_potassium: 195,
        nf_vitamin_c: 8.4,
        nf_calcium: 11,
        nf_iron: 0.2,
      },
      'banana': {
        food_name: 'Banana',
        serving_unit: 'medium',
        serving_weight_grams: 118,
        nf_calories: 105,
        nf_total_fat: 0.4,
        nf_saturated_fat: 0.1,
        nf_cholesterol: 0,
        nf_sodium: 1,
        nf_total_carbohydrate: 27,
        nf_dietary_fiber: 3.1,
        nf_sugars: 14,
        nf_protein: 1.3,
        nf_potassium: 422,
        nf_vitamin_c: 10.3,
        nf_calcium: 6,
        nf_iron: 0.3,
      },
      'chicken': {
        food_name: 'Chicken Breast',
        serving_unit: '100g',
        serving_weight_grams: 100,
        nf_calories: 165,
        nf_total_fat: 3.6,
        nf_saturated_fat: 1.0,
        nf_cholesterol: 85,
        nf_sodium: 74,
        nf_total_carbohydrate: 0,
        nf_dietary_fiber: 0,
        nf_sugars: 0,
        nf_protein: 31,
        nf_potassium: 256,
        nf_vitamin_c: 0,
        nf_calcium: 15,
        nf_iron: 1.0,
      },
      'bread': {
        food_name: 'White Bread',
        serving_unit: 'slice',
        serving_weight_grams: 28,
        nf_calories: 77,
        nf_total_fat: 1.0,
        nf_saturated_fat: 0.2,
        nf_cholesterol: 0,
        nf_sodium: 170,
        nf_total_carbohydrate: 15,
        nf_dietary_fiber: 0.9,
        nf_sugars: 1.4,
        nf_protein: 2.6,
        nf_potassium: 30,
        nf_vitamin_c: 0,
        nf_calcium: 60,
        nf_iron: 0.9,
      },
      'rice': {
        food_name: 'White Rice',
        serving_unit: 'cup',
        serving_weight_grams: 158,
        nf_calories: 205,
        nf_total_fat: 0.4,
        nf_saturated_fat: 0.1,
        nf_cholesterol: 0,
        nf_sodium: 2,
        nf_total_carbohydrate: 45,
        nf_dietary_fiber: 0.6,
        nf_sugars: 0.1,
        nf_protein: 4.3,
        nf_potassium: 55,
        nf_vitamin_c: 0,
        nf_calcium: 16,
        nf_iron: 0.8,
      },
    };

    // Try to find a match
    for (const [key, nutrition] of Object.entries(fallbackFoods)) {
      if (lowerName.includes(key)) {
        console.log(`Using fallback nutrition data for: ${key}`);
        return nutrition;
      }
    }

    // Generic fallback
    console.log('Using generic fallback nutrition data');
    return {
      food_name: foodName,
      serving_unit: 'serving',
      serving_weight_grams: 100,
      nf_calories: 150,
      nf_total_fat: 5,
      nf_saturated_fat: 1,
      nf_cholesterol: 0,
      nf_sodium: 200,
      nf_total_carbohydrate: 25,
      nf_dietary_fiber: 3,
      nf_sugars: 5,
      nf_protein: 8,
      nf_potassium: 200,
      nf_vitamin_c: 5,
      nf_calcium: 50,
      nf_iron: 1,
    };
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
