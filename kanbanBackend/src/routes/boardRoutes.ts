import express from 'express';
import { createBoard, getAllUsersForBoard } from '../controllers/boardController';

const router = express.Router();

router.post('/create', createBoard);
router.get('/users', getAllUsersForBoard);

export default router;
