import express, { Request, Response } from 'express'
import * as TeamController from '../controllers/teamController'

const router = express.Router()

// Route to create a team
router.post('/create', async (req: Request, res: Response) => {
  try {
    const { teamName, members } = req.body
    const team = await TeamController.createTeam(teamName, members)
    res.json(team)
  } catch (error) {
    console.error('❌ Error creating team:', error) 
    res.status(500).json({ error: 'Failed to create team' })
  }
})

// Route to add a member to a team
router.post('/:id/add-member', async (req: Request, res: Response) => {
  try {
    const teamId = parseInt(req.params.id)
    const { newMember } = req.body
    const team = await TeamController.addTeamMember(teamId, newMember)
    res.json(team)
  } catch (error) {
    console.error('❌ Add Member Error:', error)
    res.status(500).json({ error: 'Failed to add member' })
  }
})

export default router
