// API Configuration - Uses environment variables for security
// For development, set these environment variables in your .env file

export const API_KEYS = {
  // Google Cloud Vision API
  GOOGLE_VISION_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_VISION_API_KEY || '',
  GOOGLE_VISION_API_URL: 'https://vision.googleapis.com/v1/images:annotate',
  
  // Nutritionix API
  NUTRITIONIX_APP_ID: process.env.EXPO_PUBLIC_NUTRITIONIX_APP_ID || '',
  NUTRITIONIX_API_KEY: process.env.EXPO_PUBLIC_NUTRITIONIX_API_KEY || '',
  NUTRITIONIX_API_URL: 'https://trackapi.nutritionix.com',
  
  // Supabase Configuration
  SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
  
  // OpenAI API Configuration
  OPENAI_API_KEY: process.env.EXPO_PUBLIC_OPENAI_API_KEY || '',
};

// API Keys Configuration:
// - Google Vision API: Set EXPO_PUBLIC_GOOGLE_VISION_API_KEY in .env
// - Nutritionix API: Set EXPO_PUBLIC_NUTRITIONIX_APP_ID and EXPO_PUBLIC_NUTRITIONIX_API_KEY in .env
// - Supabase: Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in .env
// - OpenAI: Set EXPO_PUBLIC_OPENAI_API_KEY in .env