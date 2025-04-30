import { z } from 'zod';

export const schema = z.object({
  email: z
    .string()
    .email({ message: 'Please enter a valid email' })
    .min(1, { message: 'Email is required' }),
});

export type ForgotPasswordFormData = z.infer<typeof schema>;
