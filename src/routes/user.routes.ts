// filename: src/routes/user.routes.ts
import { Router } from 'express';
import {
  createUserController,
  getUserByIdController,
  getAllUsersController,
} from '../controllers/user.controller';

const router = Router();

router.post('/', createUserController);
router.get('/', getAllUsersController);
router.get('/:id', getUserByIdController);

export default router;