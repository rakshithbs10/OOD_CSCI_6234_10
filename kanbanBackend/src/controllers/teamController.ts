import { PrismaClient } from '../../generated/prisma'

const prisma = new PrismaClient()

// Create a new team
export const createTeam = async (teamName: string, members: string[]) => {
    return prisma.team.create({
      data: {
        name: teamName,
        members: members,
      },
    })
  }
  

// Add a new member to an existing team
export const addTeamMember = async (teamId: number, newMember: string) => {
    if (!newMember || newMember.trim() === '') {
      throw new Error('Invalid member name')
    }
  
    const team = await prisma.team.findUnique({ where: { id: teamId } })
    if (!team) throw new Error('Team not found')
  
    return prisma.team.update({
      where: { id: teamId },
      data: {
        members: {
          set: [...team.members, newMember]
        }
      }
    })
  }
