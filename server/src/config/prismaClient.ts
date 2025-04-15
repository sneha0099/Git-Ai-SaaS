import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
}).$extends(withAccelerate());

export default prisma;
