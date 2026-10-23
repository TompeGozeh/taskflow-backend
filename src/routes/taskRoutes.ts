import { Router } from 'express';
import { createTask, getTasksByProject, updateTaskStatus } from '../controllers/taskController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.use(authenticateToken);
router.post('/', createTask);
router.get('/project/:projectId', getTasksByProject);
router.patch('/:taskId/status', updateTaskStatus);

export default router;
