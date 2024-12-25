import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const localDepot = await prisma.depot.create({
    data: {
      displayName: 'Local Depot',
      logo: '/local-depot-logo.jpg',
      hosts: {
        create:{
          name:"localhost"
        }
      }
    }
  })


  console.log({localDepot})
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })