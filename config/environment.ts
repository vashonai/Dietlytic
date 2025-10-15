import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export const config = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
    maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || '1000'),
    temperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.7'),
  },
  app: {
    name: process.env.APP_NAME || 'Dietlytic',
    version: process.env.APP_VERSION || '1.0.0',
  },
};

// Validate required environment variables
export const validateEnvironment = () => {
  const requiredVars = ['OPENAI_API_KEY'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn(`Missing required environment variables: ${missingVars.join(', ')}`);
    console.warn('Please check your .env file and ensure all required variables are set.');
  }
  
  return missingVars.length === 0;
};
