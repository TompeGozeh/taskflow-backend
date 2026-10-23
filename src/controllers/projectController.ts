import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { prisma } from '../config/prisma';

export const createProject = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, description } = req.body;
    const userId = req.user?.id;

    if (!title) {
      return res.status(400).json({ message: 'El titulo del proyecto es obligatorio.' });
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        ownerId: userId!,
        members: {
          create: {
            userId: userId!,
            role: 'OWNER',
          },
        },
      },
      include: {
        members: true,
      },
    });

    return res.status(201).json(project);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al crear el proyecto.' });
  }
};

export const getMyProjects = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    const projects = await prisma.project.findMany({
      where: {
        members: {
          some: {
            userId: userId!,
          },
        },
      },
      include: {
        owner: {
          select: { id: true, fullName: true, email: true },
        },
        _count: {
          select: { tasks: true, members: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return res.json(projects);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al obtener proyectos.' });
  }
};
