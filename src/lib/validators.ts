import { z } from 'zod';

export const AGE_RANGES = ['13-17', '18-24', '25-34', '35+'] as const;
export const LEVELS = ['beginner', 'elementary', 'intermediate'] as const;
export const GOALS = ['conversation', 'vocabulary', 'school', 'travel', 'general'] as const;

export const signupSchema = z.object({
  fullName: z.string().min(2, 'نام کامل حداقل ۲ حرف باشد'),
  email: z.string().email('ایمیل معتبر وارد کنید'),
  password: z.string().min(6, 'رمز عبور حداقل ۶ کاراکتر باشد'),
  ageRange: z.enum(AGE_RANGES).optional(),
  level: z.enum(LEVELS).optional(),
  learningGoal: z.enum(GOALS).optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const savedWordSchema = z.object({
  wordId: z.string().min(1),
});

export const quizResultSchema = z.object({
  quizId: z.string().optional(),
  score: z.number().min(0).max(100),
  total: z.number().int().positive(),
  strengths: z.array(z.string()).optional(),
  weaknesses: z.array(z.string()).optional(),
});

export const aiMessageSchema = z.object({
  conversationId: z.string().optional(),
  message: z.string().min(1),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
