import { z } from 'zod';

// Define validation limits as constants
const USERNAME_MIN_LENGTH = 3;
const PASSWORD_MIN_LENGTH = 8;

export const schema = z.object({
  username: z
    .string()
    .min(USERNAME_MIN_LENGTH, {
      message: `Username must be at least ${USERNAME_MIN_LENGTH} characters`,
    })
    .min(1, { message: 'Username is required' }),
  email: z
    .string()
    .email({ message: 'Please enter a valid email' })
    .min(1, { message: 'Email is required' }),
  password: z
    .string()
    .min(PASSWORD_MIN_LENGTH, {
      message: `New password must be at least ${PASSWORD_MIN_LENGTH} characters`,
    })
    .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])/, {
      message: 'Password must contain uppercase, lowercase, number, and special character',
    })
    .min(1, { message: 'Password is required' }),
});

export type SignUpFormData = z.infer<typeof schema>;
