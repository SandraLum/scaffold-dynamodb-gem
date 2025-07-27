// filename: src/server.ts
import express, { Express, Request, Response } from 'express';
import { config } from './config';
import { errorHandler } from './middlewares/errorHandler';
import userRouter from './routes/user.routes';

const app: Express = express();
const port = config.port;

// Middlewares
app.use(express.json());

// Routes
app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript + DynamoDB Server is running! 🚀');
});

app.use('/api/v1/users', userRouter);

// Centralized Error Handler
app.use(errorHandler);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});