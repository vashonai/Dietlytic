// React Native compatible configuration
// Note: Environment variables should be configured in your app's build process
// For development, you can use Expo's environment variables or hardcode values

export const config = {
  api: {
    baseUrl: __DEV__ ? 'http://localhost:3001/api' : 'https://your-production-api.com/api',
  },
  openai: {
    // OpenAI configuration is now handled by the backend
    apiKey: '', // Not needed on frontend
    model: 'gpt-4',
    maxTokens: 1500,
    temperature: 0.7,
  },
  app: {
    name: 'NutriHelp',
    version: '1.0.0',
  },
};

// Validate configuration
export const validateEnvironment = () => {
  // Check if API base URL is configured
  if (!config.api.baseUrl) {
    console.warn('API base URL is not configured. Please update config/environment.ts');
    return false;
  }
  
  console.log('Configuration validated successfully');
  return true;
};
