# Dietlytic Backend API

A Node.js/Express backend API for the Dietlytic fitness app, providing secure OpenAI integration for the fitness coach chatbot.

## Features

- 🤖 **OpenAI Integration** - Secure server-side API calls to OpenAI
- 🔒 **Security** - Rate limiting, CORS, and input validation
- 📱 **Mobile Ready** - Optimized for React Native/Expo apps
- 🏥 **Health Monitoring** - Health check endpoints
- 📊 **Logging** - Request logging and error tracking
- ⚡ **Performance** - Efficient API design with proper error handling

## Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

Copy the example environment file and configure your settings:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# OpenAI Configuration
OPENAI_API_KEY=sk-your-actual-openai-api-key-here
OPENAI_MODEL=gpt-3.5-turbo
OPENAI_MAX_TOKENS=1000
OPENAI_TEMPERATURE=0.7

# CORS Configuration
CORS_ORIGIN=http://localhost:8081

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 3. Start the Server

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm run build
npm start
```

The server will start on `http://localhost:3001`

## API Endpoints

### Health Check
- **GET** `/health` - Server health status

### Chat Endpoints
- **POST** `/api/chat/message` - Send a message to the fitness coach
- **GET** `/api/chat/quick-tip` - Get a random fitness tip
- **GET** `/api/chat/motivation` - Get a motivational message
- **POST** `/api/chat/clear` - Clear conversation history

## API Documentation

### POST /api/chat/message

Send a message to the fitness coach.

**Request Body:**
```json
{
  "message": "What should I eat for breakfast?",
  "conversationHistory": [
    {
      "id": "123",
      "role": "user",
      "content": "Hello",
      "timestamp": "2024-01-01T00:00:00.000Z"
    }
  ],
  "userId": "optional-user-id"
}
```

**Response:**
```json
{
  "success": true,
  "message": {
    "id": "456",
    "role": "assistant",
    "content": "For breakfast, I recommend...",
    "timestamp": "2024-01-01T00:00:00.000Z"
  },
  "conversationHistory": [...]
}
```

### GET /api/chat/quick-tip

Get a random fitness tip.

**Response:**
```json
{
  "success": true,
  "tip": "💪 **Quick Fitness Tip:**\n\nStart your day with a glass of water to kickstart your metabolism!"
}
```

### GET /api/chat/motivation

Get a motivational message.

**Response:**
```json
{
  "success": true,
  "message": "Every step forward is progress! You're doing great! 🌟"
}
```

## Security Features

### Rate Limiting
- **100 requests per 15 minutes** per IP address
- Configurable via environment variables
- Returns 429 status when limit exceeded

### CORS Protection
- Configurable allowed origins
- Prevents unauthorized cross-origin requests
- Default: `http://localhost:8081` (Expo default)

### Input Validation
- Message length limits (1000 characters)
- Content-Type validation
- Request body validation

### Error Handling
- Comprehensive error logging
- Secure error responses (no stack traces in production)
- Graceful degradation

## Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | `3001` | No |
| `NODE_ENV` | Environment mode | `development` | No |
| `OPENAI_API_KEY` | OpenAI API key | - | ✅ Yes |
| `OPENAI_MODEL` | OpenAI model | `gpt-3.5-turbo` | No |
| `OPENAI_MAX_TOKENS` | Max response tokens | `1000` | No |
| `OPENAI_TEMPERATURE` | Response creativity | `0.7` | No |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:8081` | No |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | `900000` | No |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` | No |

## Development

### Project Structure
```
backend/
├── src/
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Custom middleware
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── types/          # TypeScript types
│   └── index.ts        # Main server file
├── dist/               # Compiled JavaScript
├── .env               # Environment variables
├── package.json
└── tsconfig.json
```

### Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run tests (not implemented yet)

### Adding New Endpoints

1. **Create controller** in `src/controllers/`
2. **Define types** in `src/types/`
3. **Add route** in `src/routes/`
4. **Update main server** in `src/index.ts`

## Deployment

### Environment Setup
1. Set `NODE_ENV=production`
2. Configure production CORS origins
3. Set up proper OpenAI API key
4. Configure rate limiting for production load

### Docker (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3001
CMD ["npm", "start"]
```

### Health Monitoring
- Health check endpoint: `GET /health`
- Returns server status, uptime, and environment info
- Use for load balancer health checks

## Troubleshooting

### Common Issues

1. **"OpenAI API key not configured"**
   - Check your `.env` file
   - Verify `OPENAI_API_KEY` is set correctly
   - Ensure no extra spaces or quotes

2. **CORS errors in mobile app**
   - Update `CORS_ORIGIN` in `.env`
   - For Expo, use your tunnel URL or local IP
   - Check that the frontend is using the correct API URL

3. **Rate limit exceeded**
   - Increase `RATE_LIMIT_MAX_REQUESTS` in `.env`
   - Implement client-side request queuing
   - Consider user-based rate limiting

4. **OpenAI API errors**
   - Check your OpenAI account status
   - Verify API key permissions
   - Check rate limits on OpenAI side

### Debug Mode
Set `NODE_ENV=development` to see detailed error messages and stack traces.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is part of the Dietlytic fitness app.
