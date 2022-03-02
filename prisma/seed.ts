import { Prisma, PrismaClient } from '@prisma/client'
import faker from 'faker'

const prisma = new PrismaClient()

const NUMBER_OF_USERS = 10
const NUMBER_OF_PROJECTS = 6
const NUMBER_OF_SESSIONS = 3
const MAX_SESSIONS = 3
const MAX_PROJECTS = 3

const users: Prisma.UserCreateInput[] = Array.from({
  length: NUMBER_OF_USERS,
}).map((_, i) => ({
  email: faker.internet.email(),
  name: faker.name.firstName(),
  projects: {
    createMany: {
      data: Array.from({
        length: faker.datatype.number({ min: 0, max: MAX_PROJECTS }),
      }).map(() => ({
        content: faker.lorem.paragraphs(),
        title: faker.lorem.words(),
      })),
    },
  },
  sessions: {
    createMany: {
      data: Array.from({
        length: faker.datatype.number({ min: 1, max: MAX_SESSIONS }),
      }).map(() => ({
        bio: faker.lorem.paragraph(),
      })),
    },
  },
}))

const projects: Prisma.ProjectCreateInput[] = Array.from({
  length: NUMBER_OF_PROJECTS,
}).map((_, i) => ({
  name: faker.title(),
  sessions: { 
    createMany: {
      data: Array.from({
        length: faker.datatype.number({ min: 0, max: MAX_SESSIONS})
      })
    }
  }
}))

const sessions: Prisma.SessionCreateInput[] = Array.from({
  length: NUMBER_OF_SESSIONS,
}).map((_, i) => ({
  session_id: faker.lorem.number(),
  subject: {
    createOne: {
      data: {
        subject_id: 'test'
      }
    }
  }
}))

async function main() {
  await prisma.$transaction(
    users.map((user) =>
      prisma.user.create({
        data: user,
      }),
    ),
  ),
  await prisma.$transaction(
    projects.map((project) => 
      prisma.project.create({
        data: project,
      })
    )
  ),
  await prisma.$transaction(
    sessions.map((session) => 
      prisma.session.create({
        data: session,
      })
    )
  )
}

main().finally(async () => {
  await prisma.$disconnect()
})