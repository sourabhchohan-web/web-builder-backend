import { Router } from 'express';
import { generateAIContent } from '../controllers/ai.controller';
import { checkRole } from '../middleware/rbac';
import { authenticate } from '../middleware/auth';
import { UserRole } from '../models/User';

const router = Router();

// Only ADMIN and CREATOR can use AI features
router.post('/generate', authenticate, checkRole([UserRole.ADMIN, UserRole.CREATOR]), generateAIContent);

export default router;
