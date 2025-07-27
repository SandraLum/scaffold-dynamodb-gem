import { Router, Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';
import * as userController from '../controllers/user.controller.js';

const router = Router();

const userSchema = z.object({
  name: z.string(),
  email: z.string().email()
});

router.post('/', validateBody(userSchema), userController.createUser);
router.get('/:id', userController.getUser);
router.put('/:id', validateBody(userSchema.partial()), userController.updateUser);
router.delete('/:id', userController.deleteUser);

function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err: any) {
      (err as any).status = 400;
      next(err);
    }
  };
}

export default router;
