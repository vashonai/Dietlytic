# Quick Setup Guide

## 1. Install Dependencies

```bash
cd NutriHelp
npm install
```

## 2. Get API Keys

### Google Cloud Vision API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create/select a project
3. Enable Vision API
4. Create API Key
5. Copy the key

### Nutritionix API
1. Go to [Nutritionix](https://www.nutritionix.com/business/api)
2. Sign up for free account
3. Get App ID and API Key
4. Copy both values

### Firebase
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create new project
3. Add web app
4. Copy config object

## 3. Configure API Keys

Edit `config/apiKeys.ts` and replace the placeholder values:

```typescript
export const API_KEYS = {
  GOOGLE_VISION_API_KEY: 'your-actual-key-here',
  NUTRITIONIX_APP_ID: 'your-actual-app-id',
  NUTRITIONIX_API_KEY: 'your-actual-api-key',
  FIREBASE_CONFIG: {
    // Your Firebase config object
  }
};
```

## 4. Run the App

```bash
npm start
```

Then press:
- `i` for iOS simulator
- `a` for Android emulator
- `w` for web browser

## 5. Test the App

1. Tap "Take Photo" button
2. Take a photo of food
3. Wait for AI analysis
4. View nutrition information
5. Save to history

## Troubleshooting

- **Camera not working**: Check device permissions
- **API errors**: Verify all keys are correct
- **Build issues**: Try `expo start -c` to clear cache

## Features

✅ Camera integration  
✅ AI food recognition  
✅ Nutrition data lookup  
✅ History tracking  
✅ Modern UI  
✅ Cross-platform support  

Your AI Nutrition Assistant is ready to use! 🎉
