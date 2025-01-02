import { PrismaClient } from '@prisma/client'

let prisma = new PrismaClient({ log: [{ emit: 'event', level: 'query' }], })
// prisma.$on('query', (e) => {
//   console.log(e.query, 'took', e.duration, 'ms')
// })
export default prisma