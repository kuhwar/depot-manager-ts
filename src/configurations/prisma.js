"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
let prisma = new client_1.PrismaClient({ log: [{ emit: 'event', level: 'query' }], });
// prisma.$on('query', (e) => {
//   console.log(e.query, 'took', e.duration, 'ms')
// })
exports.default = prisma;
