import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

const router = Router();

const userSchema = z.object({
  email: z.string().email(),
  name: z.string(),
});

type UserInput = z.infer<typeof userSchema>;

function validate(schema: z.Schema<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      next(err);
    }
  };
}

router.get('/', (req, res) => userController.list(req, res));
router.post('/', validate(userSchema), (req, res) => userController.create(req, res));
router.get('/:id', (req, res) => userController.get(req, res));
router.put('/:id', validate(userSchema.partial()), (req, res) => userController.update(req, res));
router.delete('/:id', (req, res) => userController.delete(req, res));

export default router;
export type { UserInput };
