export const validateEnvironment = (): void => {
  const requiredVars = ['OPENAI_API_KEY'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn(`⚠️  Missing required environment variables: ${missingVars.join(', ')}`);
    console.warn('Please check your .env file and ensure all required variables are set.');
    console.warn('The server will start but the chatbot functionality will not work.');
  } else {
    console.log('✅ All required environment variables are set');
  }
};
