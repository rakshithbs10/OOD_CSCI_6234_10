import { Request, Response } from 'express';
import prisma from '../config/db';

export const createTask = async (req: Request, res: Response) => {
  const {
    title,
    description,
    acceptanceCriteria,
    storyPoints,
    difficulty,
    createdById,
    assignedToId,
    verifierId,
    boardId,
    verified,
    completed,
    attachment // optional: this can be a file URL or path
  } = req.body;

  try {
    const task = await prisma.task.create({
      data: {
        title,
        description,
        acceptanceCriteria,
        storyPoints,
        difficulty,
        verified: verified || false,
        completed: completed || false,
        attachment,
        createdBy: { connect: { id: createdById } },
        assignedTo: { connect: { id: assignedToId } },
        verifier: { connect: { id: verifierId } },
        board: { connect: { id: boardId } },
      },
    });

    res.status(201).json({ message: 'Task created successfully', task });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
};
