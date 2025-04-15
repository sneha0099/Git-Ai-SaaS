import app from './app';
import colors from 'colors';
import prisma from './config/prismaClient';
import { PORT } from './config/serverConfig';

const startServer = async () => {
    try {
        await prisma.$connect();
        console.log(
            colors.bold.italic.underline('Database connected successfully')
        );
        app.listen(PORT, () =>
            console.log(
                colors.green.bold.underline(`Server is running on port ${PORT}`)
            )
        );
    } catch (error) {
        console.log('Error connecting to database: ', error);
        process.exit(1);
    }
};

startServer();
