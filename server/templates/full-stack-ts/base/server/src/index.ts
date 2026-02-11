import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import { connectDb } from './config/db';
import { apiRoutes } from './routes';
import { errorHandler } from './middlewares/errorHandler';
import { notFound } from './middlewares/notFound';

dotenv.config();

const app = express();

app.use(express.json());

if (process.env.NODE_ENV === 'production') {
    app.use(helmet());
}

const clientUrl = process.env.CLIENT_URL;
app.use(
    cors({
        origin: clientUrl ?? true,
        credentials: false,
    }),
);

app.use('/api', apiRoutes);

app.use(notFound);
app.use(errorHandler);

async function start() {
    await connectDb();

    const port = Number(process.env.PORT ?? '5000');
    app.listen(port, () => {
        // eslint-disable-next-line no-console
        console.log(`⚡️ Server running on http://localhost:${port}`);
    });
}

start().catch((err: unknown) => {
    // eslint-disable-next-line no-console
    console.error('Failed to start server:', err);
    process.exit(1);
});
