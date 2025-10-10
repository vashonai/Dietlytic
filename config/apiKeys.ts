// API Configuration
// Replace these with your actual API keys

export const API_KEYS = {
  // Google Cloud Vision API
  // Get your API key from: https://console.cloud.google.com/apis/credentials
  GOOGLE_VISION_API_KEY: 'your-google-vision-api-key-here',
  
  // Nutritionix API
  // Get your credentials from: https://www.nutritionix.com/business/api
  NUTRITIONIX_APP_ID: 'your-nutritionix-app-id-here',
  NUTRITIONIX_API_KEY: 'your-nutritionix-api-key-here',
  
  // Firebase Configuration
  // Get your config from: https://console.firebase.google.com/
  FIREBASE_CONFIG: {
    apiKey: "your-firebase-api-key",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-firebase-app-id"
  }
};

// Instructions for setting up APIs:
// 
// 1. Google Cloud Vision API:
//    - Go to https://console.cloud.google.com/
//    - Create a new project or select existing
//    - Enable the Vision API
//    - Create credentials (API Key)
//    - Replace GOOGLE_VISION_API_KEY with your key
//
// 2. Nutritionix API:
//    - Go to https://www.nutritionix.com/business/api
//    - Sign up for a free account
//    - Get your App ID and API Key
//    - Replace NUTRITIONIX_APP_ID and NUTRITIONIX_API_KEY
//
// 3. Firebase:
//    - Go to https://console.firebase.google.com/
//    - Create a new project
//    - Add a web app to your project
//    - Copy the config object
//    - Replace FIREBASE_CONFIG with your config
