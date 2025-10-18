# AI Coach Agent Setup Guide

This guide will help you set up the enhanced AI Coach Agent with voice input, health-aware feedback, and intelligent meal logging capabilities.

## 🚀 Overview

The AI Coach Agent is a sophisticated health and nutrition assistant that can:
- **Voice & Text Input**: Accept meal descriptions via voice or text
- **Health-Aware Feedback**: Provide personalized advice based on user's health conditions
- **Smart Meal Logging**: Automatically log meals to food history
- **Goal Management**: Update and track user goals through conversation
- **Natural Language Processing**: Understand and analyze meal descriptions

## 📋 Prerequisites

1. **OpenAI API Key** with GPT-4 access
2. **Supabase Database** with the new tables
3. **React Native/Expo** development environment

## 🗄️ Database Setup

### 1. Run Database Migration

Execute the SQL migration script in your Supabase SQL editor:

```bash
# Copy the migration file content and run in Supabase
cat database/migrations/001_add_health_and_goals_tables.sql
```

This creates the following tables:
- `health_conditions` - Store user health conditions
- `user_goals` - Store user goals and targets
- `dietary_restrictions` - Store dietary restrictions
- `user_preferences` - Store user preferences

### 2. Verify Tables

Check that all tables were created successfully in your Supabase dashboard.

## 🔧 Backend Setup

### 1. Install Dependencies

The required packages are already included in your backend:
- `openai` - For GPT-4 integration
- `express` - For API endpoints
- `typescript` - For type safety

### 2. Environment Variables

Ensure your backend `.env` file includes:

```env
OPENAI_API_KEY=sk-your-openai-api-key-here
OPENAI_MODEL=gpt-4
OPENAI_MAX_TOKENS=1500
OPENAI_TEMPERATURE=0.7
```

### 3. Start Backend Server

```bash
cd backend
npm run dev
```

The new endpoints will be available at:
- `POST /api/chat/ai-coach` - Process AI Coach Agent input
- `POST /api/chat/analyze-meal` - Analyze meal content

## 📱 Frontend Setup

### 1. New Components Created

- `components/AICoachAgent.tsx` - Main AI Coach interface
- `screens/AICoachScreen.tsx` - Full-screen AI Coach experience
- `services/userProfileService.ts` - Enhanced user profile management
- `services/aiCoachAgentService.ts` - AI Coach Agent logic
- `services/voiceInputService.ts` - Voice input handling

### 2. Navigation Updated

The AI Coach is now available as a tab in your app:
- Tab icon: Chat bubbles
- Tab name: "AI Coach"
- Route: `/ai-coach`

### 3. Voice Input Support

Voice input is currently implemented for web browsers using the Web Speech API. For React Native, you'll need to add a speech recognition library:

```bash
# For React Native (optional)
npm install @react-native-voice/voice
# or
npm install react-native-speech-to-text
```

## 🎯 Features Overview

### 1. Health-Aware Feedback

The AI Coach considers:
- **Diabetes**: Discourages high-sugar foods, recommends low-GI alternatives
- **Hypertension**: Recommends low-sodium options, avoids processed foods
- **Heart Conditions**: Focuses on heart-healthy fats, limits saturated fats
- **Allergies/Intolerances**: Strictly avoids triggering foods

### 2. Goal-Based Recommendations

- **Weight Loss**: Emphasizes calorie deficit and portion control
- **Weight Gain**: Focuses on healthy calories and protein intake
- **Muscle Building**: Prioritizes protein timing and quality
- **General Health**: Emphasizes balanced nutrition and variety

### 3. Smart Actions

The AI Coach can automatically:
- **Log Meals**: Save recognized foods to your food history
- **Update Goals**: Modify goals based on conversation
- **Update Profile**: Add health conditions or dietary restrictions
- **Provide Feedback**: Give personalized nutrition advice

## 💬 Usage Examples

### Text Input Examples

```
"I had a large pizza with pepperoni and extra cheese for lunch"
→ AI analyzes: High calories, saturated fat, sodium
→ Provides feedback: "That's quite high in calories and saturated fat. For your weight loss goal, consider a smaller portion or a healthier alternative like a veggie pizza with thin crust."

"I want to set a goal to reduce my sugar intake"
→ AI updates: Creates new goal for reduced sugar intake
→ Provides feedback: "Great goal! I've set a target to reduce your daily sugar intake to 25g. I'll help you track this and suggest low-sugar alternatives."
```

### Voice Input Examples

```
User speaks: "I just ate a banana and some yogurt with granola"
→ AI recognizes: Banana, yogurt, granola
→ Logs meal: Automatically saves to food history
→ Provides feedback: "Nice healthy breakfast! That's a good combination of protein, fiber, and natural sugars. The granola adds some healthy fats and carbs for energy."
```

## 🔍 Health Condition Examples

### Diabetes Management

```
User: "I'm craving something sweet"
AI: "I understand the craving! Since you have diabetes, let's find a healthier alternative. How about some fresh berries with Greek yogurt, or a small piece of dark chocolate (70% cocoa or higher)? These options have less impact on blood sugar."
```

### Hypertension Management

```
User: "I had ramen for lunch"
AI: "I notice you had ramen, which is typically very high in sodium. For your hypertension, I'd recommend limiting high-sodium foods. Next time, consider making ramen at home with low-sodium broth and fresh vegetables, or try a soup with less than 600mg sodium per serving."
```

## 🎨 UI Features

### AICoachAgent Component

- **Real-time Chat**: Instant messaging interface
- **Voice Button**: Record voice input with visual feedback
- **Loading States**: Shows when AI is processing
- **Message History**: Scrollable conversation history
- **Clear Chat**: Reset conversation option

### AICoachScreen

- **Profile Summary**: Shows health conditions, goals, and restrictions
- **Visual Indicators**: Color-coded health condition severity
- **Goal Tracking**: Displays active goals and progress
- **Refresh Control**: Pull-to-refresh for updated profile data

## 🚨 Troubleshooting

### Common Issues

1. **Voice Input Not Working**
   - Check browser permissions for microphone access
   - Ensure you're using a supported browser (Chrome, Safari, Edge)
   - For React Native, install a speech recognition library

2. **AI Responses Not Health-Aware**
   - Verify user profile has health conditions set
   - Check that the user profile service is loading correctly
   - Ensure OpenAI API key has GPT-4 access

3. **Meals Not Being Logged**
   - Check Supabase connection and permissions
   - Verify the meal analysis is recognizing foods correctly
   - Check backend logs for any errors

### Debug Mode

Enable debug logging by adding to your environment:

```env
DEBUG_AI_COACH=true
```

## 🔮 Future Enhancements

Potential improvements for the AI Coach Agent:

1. **Advanced Voice Features**
   - Continuous listening mode
   - Voice commands for quick actions
   - Multi-language support

2. **Enhanced Health Integration**
   - Integration with health apps (Apple Health, Google Fit)
   - Real-time health data analysis
   - Medication interaction checking

3. **Smart Recommendations**
   - Recipe suggestions based on health conditions
   - Meal planning assistance
   - Grocery list generation

4. **Social Features**
   - Share progress with healthcare providers
   - Community challenges and support
   - Family meal planning

## 📞 Support

If you encounter any issues:

1. Check the console logs for error messages
2. Verify all environment variables are set correctly
3. Ensure database tables are created properly
4. Test API endpoints using tools like Postman

## 🎉 Success!

You now have a fully functional AI Coach Agent that can:
- ✅ Accept voice and text input
- ✅ Provide health-aware feedback
- ✅ Log meals automatically
- ✅ Update goals and profiles
- ✅ Give personalized nutrition advice

The AI Coach Agent is ready to help users achieve their health and nutrition goals with intelligent, personalized assistance!
