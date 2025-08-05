import { Router } from 'express';
import { MemberController } from '../controllers/memberController';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const memberController = new MemberController();

// All routes require authentication
router.use(authMiddleware);

// Get all members for tenant
router.get('/', memberController.getMembers);

// Create new member (admin only)
router.post('/', memberController.createMember);

// Update member (admin only)
router.put('/:id', memberController.updateMember);

// Delete member (admin only)
router.delete('/:id', memberController.deleteMember);

export default router;
