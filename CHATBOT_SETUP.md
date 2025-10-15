# Fitness Coach Chatbot Setup

This guide will help you set up the OpenAI-powered fitness coach chatbot in your Dietlytic app.

## Prerequisites

1. **OpenAI API Key**: You need an OpenAI API key to use the chatbot service.
   - Sign up at [OpenAI](https://platform.openai.com/)
   - Create an API key in your OpenAI dashboard
   - Make sure you have credits in your OpenAI account

## Setup Instructions

### 1. Configure Environment Variables

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit the `.env` file:**
   ```bash
   # Replace 'your_openai_api_key_here' with your actual OpenAI API key
   OPENAI_API_KEY=sk-your-actual-openai-api-key-here
   
   # Optional: Customize these settings
   OPENAI_MODEL=gpt-3.5-turbo
   OPENAI_MAX_TOKENS=1000
   OPENAI_TEMPERATURE=0.7
   ```

### 2. Install Dependencies

The required packages are already installed:
- `dotenv` - For environment variable management
- `openai` - For OpenAI API integration

### 3. Test the Chatbot

1. **Start your app:**
   ```bash
   npm start
   ```

2. **Navigate to the Chat tab** in your app (the chat bubble icon)

3. **Try sending a message** like:
   - "What should I eat for breakfast?"
   - "Help me create a workout plan"
   - "I need motivation to exercise"

## Features

### 🤖 **AI Fitness Coach**
- Personalized nutrition advice
- Workout plan recommendations
- Motivation and encouragement
- Health and fitness guidance
- Cultural sensitivity for Jamaican users

### 💬 **Chat Interface**
- Real-time messaging
- Message history
- Quick action buttons
- Typing indicators
- Timestamped messages

### ⚡ **Quick Actions**
- **Quick Tip**: Get random fitness tips
- **Motivation**: Receive motivational messages
- **Clear Chat**: Reset conversation history

## Configuration Options

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `OPENAI_API_KEY` | Your OpenAI API key | - | ✅ Yes |
| `OPENAI_MODEL` | OpenAI model to use | `gpt-3.5-turbo` | No |
| `OPENAI_MAX_TOKENS` | Maximum response length | `1000` | No |
| `OPENAI_TEMPERATURE` | Response creativity (0-1) | `0.7` | No |

### Model Options

- `gpt-3.5-turbo` - Fast and cost-effective (recommended)
- `gpt-4` - More advanced but slower and more expensive
- `gpt-4-turbo` - Latest GPT-4 with better performance

## Usage Examples

### Basic Questions
- "What's a healthy breakfast for weight loss?"
- "How many calories should I eat daily?"
- "What exercises can I do at home?"

### Specific Advice
- "I'm trying to lose 10 pounds, help me plan my meals"
- "I have knee problems, what exercises are safe?"
- "I'm a beginner, create a simple workout routine"

### Motivation
- "I'm feeling unmotivated to exercise"
- "I keep falling off my diet, help me stay consistent"
- "I need encouragement to keep going"

## Troubleshooting

### Common Issues

1. **"Fitness coach service is not available"**
   - Check that your `.env` file exists and has the correct API key
   - Verify your OpenAI API key is valid
   - Ensure you have credits in your OpenAI account

2. **Messages not sending**
   - Check your internet connection
   - Verify the API key is correct
   - Check the console for error messages

3. **Slow responses**
   - This is normal for AI responses
   - Consider using `gpt-3.5-turbo` for faster responses
   - Reduce `OPENAI_MAX_TOKENS` for shorter responses

### Debug Mode

To see detailed error messages, check the console output when running your app.

## Security Notes

- **Never commit your `.env` file** to version control
- **Keep your API key secure** and don't share it
- **Monitor your OpenAI usage** to avoid unexpected charges
- **Use environment variables** for all sensitive data

## Cost Considerations

- **GPT-3.5-turbo**: ~$0.002 per 1K tokens (very affordable)
- **GPT-4**: ~$0.03 per 1K tokens (more expensive)
- **Monitor usage** in your OpenAI dashboard

## Support

If you encounter issues:
1. Check the console for error messages
2. Verify your API key and environment setup
3. Test with simple messages first
4. Check your OpenAI account status

---

**Happy chatting with your AI fitness coach! 💪🤖**
