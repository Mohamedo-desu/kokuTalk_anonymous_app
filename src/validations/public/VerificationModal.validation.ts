import { z } from 'zod';

export const schema = z.object({
  code: z.string().min(1, { message: 'Code is required' }),
});

export type VerificationFormData = z.infer<typeof schema>;
