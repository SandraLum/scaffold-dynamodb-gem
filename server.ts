import express from 'express';
import { config } from './src/config';
import userRoutes from './src/routes/user.routes';
import { errorHandler } from './src/middlewares/errorHandler';

const app = express();

app.use(express.json());
app.use('/api/v1/users', userRoutes);
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
