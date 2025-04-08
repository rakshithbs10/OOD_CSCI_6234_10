import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import prisma from './config/db'
import userRoutes from './routes/userRoutes'
import teamRoutes from './routes/teamRoutes'



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


app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`)
})
