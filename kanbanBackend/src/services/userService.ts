import bcrypt from 'bcrypt'
import { PrismaClient } from '../../generated/prisma'

const prisma = new PrismaClient()

export const createUser = async (username: string, email: string, password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10)
  return prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword
    }
  })
}
