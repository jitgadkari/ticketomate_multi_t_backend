import { Router } from 'express';
import { ProjectController } from '../controllers/projectController';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const projectController = new ProjectController();

// All routes require authentication
router.use(authMiddleware);

// Get all projects for tenant
router.get('/', projectController.getProjects);

// Create project
router.post('/', projectController.createProject);

// Get single project
router.get('/:id', projectController.getProject);

// Update project
router.put('/:id', projectController.updateProject);

// Delete project
router.delete('/:id', projectController.deleteProject);

export default router;
