import { z } from 'zod';

// Define validation limits as constants
const PASSWORD_MIN_LENGTH = 8;

export const schema = z
  .object({
    newPassword: z
      .string()
      .min(PASSWORD_MIN_LENGTH, {
        message: `New password must be at least ${PASSWORD_MIN_LENGTH} characters`,
      })
      .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])/, {
        message: 'New password must contain uppercase, lowercase, number, and special character',
      })
      .min(1, { message: 'New password is required' }),

    confirmPassword: z.string().min(1, { message: 'Confirm password is required' }),

    code: z.string().min(1, { message: 'Code is required' }),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  });

export type ResetPasswordFormData = z.infer<typeof schema>;
