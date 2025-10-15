# Backend API Setup Guide

This guide will help you set up the backend API for your Dietlytic fitness app chatbot.

## 🚀 Quick Start

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your OpenAI API key

# Start development server
npm run dev
```

### 2. Frontend Configuration

The frontend is already configured to use the backend API. The app will automatically connect to `http://localhost:3001` when running locally.

### 3. Start Both Servers

**Windows:**
```bash
# Run the batch file
start-dev.bat
```

**Mac/Linux:**
```bash
# Make executable and run
chmod +x start-dev.sh
./start-dev.sh
```

**Manual:**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
npm start
```

## 🔧 Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# OpenAI Configuration (REQUIRED)
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

### Frontend Environment Variables

Create a `.env` file in the root directory:

```env
# Backend API URL
EXPO_PUBLIC_API_URL=http://localhost:3001/api
```

## 📱 Mobile Development

### For Physical Device Testing

1. **Find your computer's IP address:**
   - Windows: `ipconfig`
   - Mac/Linux: `ifconfig`

2. **Update CORS_ORIGIN in backend/.env:**
   ```env
   CORS_ORIGIN=http://YOUR_IP_ADDRESS:8081
   ```

3. **Update API URL in frontend .env:**
   ```env
   EXPO_PUBLIC_API_URL=http://YOUR_IP_ADDRESS:3001/api
   ```

### For Expo Go App

1. **Start Expo tunnel:**
   ```bash
   npm start -- --tunnel
   ```

2. **Update CORS_ORIGIN to allow tunnel URL:**
   ```env
   CORS_ORIGIN=*
   ```

## 🔍 Testing the API

### Health Check
```bash
curl http://localhost:3001/health
```

### Send a Message
```bash
curl -X POST http://localhost:3001/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{"message": "What should I eat for breakfast?"}'
```

### Get Quick Tip
```bash
curl http://localhost:3001/api/chat/quick-tip
```

## 🐛 Troubleshooting

### Common Issues

#### 1. "Network request failed" in mobile app
- **Cause:** CORS or network connectivity issues
- **Solution:** 
  - Check CORS_ORIGIN in backend/.env
  - Ensure both servers are running
  - Use IP address instead of localhost for physical device

#### 2. "OpenAI API key not configured"
- **Cause:** Missing or invalid API key
- **Solution:**
  - Check backend/.env file
  - Verify OPENAI_API_KEY is set correctly
  - Ensure no extra spaces or quotes

#### 3. "Rate limit exceeded"
- **Cause:** Too many requests sent
- **Solution:**
  - Wait 15 minutes or increase RATE_LIMIT_MAX_REQUESTS
  - Implement client-side request queuing

#### 4. Backend won't start
- **Cause:** Port already in use or missing dependencies
- **Solution:**
  - Change PORT in .env file
  - Run `npm install` in backend directory
  - Check for TypeScript compilation errors

### Debug Mode

Enable detailed logging by setting:
```env
NODE_ENV=development
```

## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Server health check |
| POST | `/api/chat/message` | Send message to coach |
| GET | `/api/chat/quick-tip` | Get random fitness tip |
| GET | `/api/chat/motivation` | Get motivational message |
| POST | `/api/chat/clear` | Clear conversation |

## 🔒 Security Features

- **Rate Limiting:** 100 requests per 15 minutes per IP
- **CORS Protection:** Configurable allowed origins
- **Input Validation:** Message length and content validation
- **Error Handling:** Secure error responses
- **Helmet Security:** HTTP security headers

## 🚀 Production Deployment

### Environment Setup
```env
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com
RATE_LIMIT_MAX_REQUESTS=1000
```

### Build and Start
```bash
cd backend
npm run build
npm start
```

### Health Monitoring
Monitor the `/health` endpoint for server status.

## 📝 Development Tips

1. **Hot Reload:** Backend automatically restarts on file changes
2. **Logging:** All requests are logged with Morgan
3. **Error Tracking:** Comprehensive error logging and handling
4. **Type Safety:** Full TypeScript support
5. **API Testing:** Use Postman or curl for testing endpoints

## 🤝 Contributing

1. Follow the existing code structure
2. Add proper error handling
3. Include TypeScript types
4. Test your changes thoroughly
5. Update documentation as needed

---

**Need Help?** Check the console logs for detailed error messages and ensure all environment variables are properly configured.
