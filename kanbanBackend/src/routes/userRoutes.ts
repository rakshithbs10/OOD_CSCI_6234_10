import express, { Request, Response } from 'express'
import * as UserController from '../controllers/userController'
import jwt from 'jsonwebtoken'

const router = express.Router()

// Create a new user
router.post('/create', async (req: Request, res: Response) => {
  try {
    const user = await UserController.createUser(req.body)
    res.status(201).json(user)
  } catch (error) {
    console.error('❌ Create User Error:', error)
    res.status(500).json({ error: 'Failed to create user' })
  }
})

// Soft delete user by ID
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id)
    const deletedUser = await UserController.softDeleteUser(userId)
    res.json(deletedUser)
  } catch (error) {
    console.error('❌ Delete User Error:', error)
    res.status(500).json({ error: 'Failed to delete user' })
  }
})

// Search for users by query
router.get('/search', async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string
    const results = await UserController.searchUsers(query)
    res.json(results)
  } catch (error) {
    console.error('❌ Search Error:', error)
    res.status(500).json({ error: 'Search failed' })
  }
})

// Login route with token generation
router.post('/login', async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body
      const user = await UserController.verifyPassword(email, password)
  
      if (!user) {
        res.status(401).json({ error: 'Invalid credentials' })
        return
      }
  
      const JWT_SECRET = process.env.JWT_SECRET
      if (!JWT_SECRET) {
        res.status(500).json({ error: 'JWT secret not set' })
        return
      }
  
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '2h' }
      )
  
      res.json({ token, user })
    } catch (error) {
      console.error('Login Error:', error)
      res.status(500).json({ error: 'Login failed' })
    }
  })
export default router
