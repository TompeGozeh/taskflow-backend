import { Router } from 'express';
import { createProject, getMyProjects } from '../controllers/projectController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.use(authenticateToken);
router.post('/', createProject);
router.get('/', getMyProjects);

export default router;
