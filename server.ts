import express, { Application } from 'express';
import { config } from './src/config/index.js';
import userRoutes from './src/routes/user.routes.js';
import errorHandler from './src/middlewares/errorHandler.js';

const app: Application = express();
app.use(express.json());
app.use('/api/v1/users', userRoutes);
app.use(errorHandler);

const PORT = config.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
