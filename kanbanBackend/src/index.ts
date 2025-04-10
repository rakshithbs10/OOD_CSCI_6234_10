import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import prisma from './config/db'
import userRoutes from './routes/userRoutes'
import teamRoutes from './routes/teamRoutes'
import boardRoutes from './routes/boardRoutes';
import taskRoutes from './routes/taskRoutes';
import columnRoutes from './routes/columnRoutes';

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5001

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Kanban Backend is running 🚀');
});

app.use('/api/users', userRoutes)
app.use('/api/teams', teamRoutes)
app.use('/api/boards', boardRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/column', columnRoutes);

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`)
})
