import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { prisma } from '../config/prisma';

export const createTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { projectId, title, description, priority, assignedTo, dueDate } = req.body;

    if (!projectId || !title) {
      return res.status(400).json({ message: 'projectId y title son obligatorios.' });
    }

    const task = await prisma.task.create({
      data: {
        projectId,
        title,
        description,
        priority: priority || 'MEDIUM',
        assignedTo,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    });

    return res.status(201).json(task);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al crear la tarea.' });
  }
};

export const getTasksByProject = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { projectId } = req.params;

    const tasks = await prisma.task.findMany({
      where: { projectId },
      include: {
        assignee: {
          select: { id: true, fullName: true, avatarUrl: true },
        },
        _count: {
          select: { comments: true },
        },
      },
      orderBy: { position: 'asc' },
    });

    return res.json(tasks);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al obtener tareas.' });
  }
};

export const updateTaskStatus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { taskId } = req.params;
    const { status, position } = req.body;

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        status,
        position: position !== undefined ? position : undefined,
      },
    });

    return res.json(updatedTask);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al actualizar tarea.' });
  }
};
