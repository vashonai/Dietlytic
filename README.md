# Dietlytic - AI Nutrition Assistant

A React Native app that uses AI to analyze food photos and provide detailed nutritional information.

## Features

- 📸 **Camera Integration**: Take photos of food items using the device camera
- 🤖 **AI Food Recognition**: Uses Google Cloud Vision API to identify food items
- 📊 **Nutritional Analysis**: Get detailed nutritional information using Nutritionix API
- 💾 **History Tracking**: Save and view your nutrition history with Firebase
- 🎨 **Modern UI**: Clean, intuitive interface with smooth animations

## Tech Stack

- **React Native** with Expo
- **TypeScript** for type safety
- **Google Cloud Vision API** for food recognition
- **Nutritionix API** for nutritional data
- **Firebase** for data storage
- **Expo Camera** for image capture

## Setup Instructions

### 1. Install Dependencies

```bash
cd Dietlytic
npm install
```

### 2. API Keys Configuration

1. **Google Cloud Vision API**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable the Vision API
   - Create credentials (API Key)
   - Copy the API key

2. **Nutritionix API**:
   - Go to [Nutritionix API](https://www.nutritionix.com/business/api)
   - Sign up for a free account
   - Get your App ID and API Key from the dashboard

3. **Firebase**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Add a web app to your project
   - Copy the configuration object

4. **Update Configuration**:
   - Open `config/apiKeys.ts`
   - Replace the placeholder values with your actual API keys

### 3. Run the App

```bash
# Start the development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on web
npm run web
```

## App Structure

```
Dietlytic/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx          # Main camera screen
│   │   └── explore.tsx        # Nutrition history
│   └── _layout.tsx
├── components/
│   ├── CameraComponent.tsx    # Camera interface
│   ├── FoodSelection.tsx      # Food selection screen
│   ├── NutritionDisplay.tsx   # Nutrition results
│   └── ...
├── services/
│   ├── visionService.ts       # Google Vision API
│   ├── nutritionService.ts    # Nutritionix API
│   └── firebaseService.ts     # Firebase integration
├── config/
│   └── apiKeys.ts            # API configuration
└── ...
```

## How It Works

1. **Photo Capture**: User takes a photo of their food
2. **AI Recognition**: Google Vision API analyzes the image and identifies food items
3. **Food Selection**: If multiple foods are detected, user selects the desired item
4. **Nutrition Lookup**: Nutritionix API provides detailed nutritional information
5. **Display Results**: App shows comprehensive nutrition breakdown
6. **Save to History**: User can save the entry to their nutrition history

## API Usage

### Google Cloud Vision API
- **Purpose**: Food recognition and object detection
- **Features Used**: Label Detection, Object Localization
- **Cost**: Pay-per-request (first 1,000 requests/month free)

### Nutritionix API
- **Purpose**: Nutritional data lookup
- **Features Used**: Natural language nutrition search
- **Cost**: Free tier available with usage limits

### Firebase
- **Purpose**: User data storage and authentication
- **Features Used**: Firestore database, anonymous authentication
- **Cost**: Free tier with generous limits

## Troubleshooting

### Common Issues

1. **Camera Permission Denied**:
   - Ensure camera permissions are granted in device settings
   - Check that permissions are properly configured in `app.json`

2. **API Key Errors**:
   - Verify all API keys are correctly set in `config/apiKeys.ts`
   - Ensure APIs are enabled in their respective consoles

3. **Build Errors**:
   - Clear cache: `expo start -c`
   - Reinstall dependencies: `rm -rf node_modules && npm install`

### Development Tips

- Use the Expo Go app for quick testing on physical devices
- Check the console for detailed error messages
- Test with different food items to verify AI accuracy
- Ensure good lighting when taking photos for better recognition

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Check the troubleshooting section above
- Review API documentation for Google Vision and Nutritionix
- Open an issue on GitHub

---

**Note**: This app requires valid API keys to function. Make sure to set up all three services (Google Vision, Nutritionix, and Firebase) before running the app.