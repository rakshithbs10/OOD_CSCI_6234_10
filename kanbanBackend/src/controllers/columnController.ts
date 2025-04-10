import { RequestHandler } from 'express'
import { PrismaClient } from '../../generated/prisma'

const prisma = new PrismaClient()

export const renameColumn: RequestHandler = async (req, res) => {
  const columnId = parseInt(req.params.columnId)
  const { name } = req.body

  try {
    const updated = await prisma.column.update({
      where: { id: columnId },
      data: { name }
    })
    res.json({ message: 'Column renamed', column: updated })
  } catch (error) {
    console.error('❌ Rename error:', error)
    res.status(500).json({ error: 'Failed to rename column' })
  }
}

export const deleteColumn: RequestHandler = async (req, res) => {
  const columnId = parseInt(req.params.columnId)

  try {
    await prisma.column.delete({ where: { id: columnId } })
    res.json({ message: 'Column deleted' })
  } catch (error) {
    console.error('❌ Delete error:', error)
    res.status(500).json({ error: 'Failed to delete column' })
  }
}
