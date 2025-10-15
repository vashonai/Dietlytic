import { Router } from 'express';
import { chatController } from '../controllers/chatController';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();

// POST /api/chat/message - Send a message to the fitness coach
router.post('/message', validateRequest, chatController.sendMessage.bind(chatController));

// GET /api/chat/quick-tip - Get a random fitness tip
router.get('/quick-tip', chatController.getQuickTip.bind(chatController));

// GET /api/chat/motivation - Get a motivational message
router.get('/motivation', chatController.getMotivation.bind(chatController));

// POST /api/chat/clear - Clear conversation history
router.post('/clear', chatController.clearConversation.bind(chatController));

export default router;
