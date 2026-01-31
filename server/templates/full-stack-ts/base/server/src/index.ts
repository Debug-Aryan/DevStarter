import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import healthRouter from './routes/health';
import { pool } from './config/db';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/health', healthRouter);

app.get('/', (req: Request, res: Response) => {
    res.send('Full-Stack TypeScript Server is running!');
});

// Test DB connection
pool.connect()
    .then(() => console.log('Parsed database connection established'))
    .catch(err => console.error('Database connection error:', err));

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
