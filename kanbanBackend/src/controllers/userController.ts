import { PrismaClient } from '../../generated/prisma'
import bcrypt from 'bcrypt'


const prisma = new PrismaClient()

export const createUser = async (userData: any) => {
  const hashedPassword = await bcrypt.hash(userData.password, 10)
  return prisma.user.create({
    data: {
      ...userData,
      password: hashedPassword,
    },
  })
}

export const softDeleteUser = async (userId: number) => {
  return prisma.user.update({
    where: { id: userId },
    data: { isDeleted: true },
  })
}

export const searchUsers = async (query: string) => {
    return prisma.user.findMany({
      where: {
        username: {
          startsWith: query,
          mode: 'insensitive',
        },
        isDeleted: false,
      },
    })
  }

export const verifyPassword = async (email: string, inputPassword: string) => {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return null
  const match = await bcrypt.compare(inputPassword, user.password)
  return match ? user : null

}
