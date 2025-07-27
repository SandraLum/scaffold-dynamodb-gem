// filename: src/types/user.types.ts
import { z } from 'zod';

/**
 * @description Zod schema for creating a user. Used for request body validation.
 */
export const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
});

/**
 * @description Zod schema for updating a user. All fields are optional.
 */
export const UpdateUserSchema = CreateUserSchema.partial();


/**
 * @description TypeScript type inferred from the CreateUserSchema.
 */
export type CreateUserInput = z.infer<typeof CreateUserSchema>;

/**
 * @description TypeScript type inferred from the UpdateUserSchema.
 */
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;

/**
 * @description Represents a User entity as it is stored in the database.
 */
export interface User extends CreateUserInput {
  userId: string;
  createdAt: string;
  updatedAt: string;
}