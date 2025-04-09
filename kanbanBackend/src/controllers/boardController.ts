import { Request, Response } from 'express';
import prisma from '../config/db';

export const createBoard = async (req: Request, res: Response) => {
  const { name, summary, userIds } = req.body;

  if (!name || !Array.isArray(userIds) || userIds.length === 0) {
    return res.status(400).json({ error: 'Board name and users are required.' });
  }

  try {
    const board = await prisma.board.create({
      data: {
        name,
        summary,
        users: {
          connect: userIds.map((id: number) => ({ id })),
        },
      },
      include: {
        users: true,
      },
    });

    res.status(201).json({ message: 'Board created successfully', board });
  } catch (error) {
    console.error('Error creating board:', error);
    res.status(500).json({ error: 'Failed to create board.' });
  }
};

export const getAllUsersForBoard = async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      where: { isDeleted: false },
      select: { id: true, username: true, email: true },
    });

    res.json(users);
  } catch (error) {
    console.error('Error fetching users for board:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};
