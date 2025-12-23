import { Router } from 'express';
import { getAssets, uploadAsset, deleteAsset } from '../controllers/asset.controller';
import { checkRole } from '../middleware/rbac';
import { authenticate } from '../middleware/auth';
import { UserRole } from '../models/User';

const router = Router();

// All roles can view assets
router.get('/', authenticate, checkRole([UserRole.ADMIN, UserRole.CREATOR, UserRole.USER]), getAssets);

// Only ADMIN and CREATOR can upload
router.post('/upload', authenticate, checkRole([UserRole.ADMIN, UserRole.CREATOR]), uploadAsset);

// Only ADMIN can delete
router.delete('/:id', authenticate, checkRole([UserRole.ADMIN]), deleteAsset);

export default router;
