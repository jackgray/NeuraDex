import { Prisma } from '@prisma/client'
import { NextApiHandler } from 'next'
import { prisma } from '../../lib/prisma'

const handler: NextApiHandler = async (req, res) => {
  if (req.method === 'GET') {
    try {
      const studies = await prisma.study.findMany({
        include: { profiles: true },
      })

      res.status(200).json(studies)
    } catch (error) {
      console.error(error)

      res.status(500).json(error)
      return
    }
  } else if (req.method === 'POST') {
    try {
      const createdStudy = await prisma.study.create({
        data: req.body,
      })

      res.status(200).json(createdStudy)
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          res
            .status(409)
            .json({ error: 'A study with this email already exists' })
          return
        }
      }

      console.error(e)
      res.status(500)
      return
    }
  } else {
    res.status(404)
    return
  }
}

export default handler