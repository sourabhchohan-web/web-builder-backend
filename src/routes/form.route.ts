import { Router } from 'express';
import { submitForm, getSubmissions } from '../controllers/form.controller';
import { checkRole } from '../middleware/rbac';
import { authenticate } from '../middleware/auth';
import { UserRole } from '../models/User';

const router = Router();

// Publicly submit forms
router.post('/submit', submitForm);

// Only ADMIN and CREATOR can view submissions
router.get('/submissions', authenticate, checkRole([UserRole.ADMIN, UserRole.CREATOR]), getSubmissions);

export default router;
