import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

console.log('📌 Attempting to connect to the database...');
export const connectDB = async () => {
    try {
        await prisma.$connect();
        console.log('✅ Database connected successfully!');
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        process.exit(1); // Exit process on failure
    }
};

export default prisma;
