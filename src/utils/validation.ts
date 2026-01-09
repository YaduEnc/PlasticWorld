import { z } from 'zod';

/**
 * Validation schemas for authentication endpoints
 */

// Google Sign-In
export const googleSignInSchema = z.object({
  idToken: z.string().min(1, 'ID token is required'),
});

// Complete Profile
export const completeProfileSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be at most 30 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  phoneNumber: z
    .string()
    .regex(/^\+[1-9]\d{1,14}$/, 'Phone number must be in E.164 format (e.g., +1234567890)')
    .optional(),
  age: z.number().int().min(13, 'Age must be at least 13').max(120, 'Age must be at most 120'),
});

// Refresh Token
export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

// Device Info (for device creation)
export const deviceInfoSchema = z.object({
  deviceName: z.string().min(1, 'Device name is required').max(100, 'Device name too long'),
  deviceType: z.enum(['ios', 'android', 'web', 'desktop'], {
    errorMap: () => ({ message: 'Device type must be ios, android, web, or desktop' }),
  }),
  deviceToken: z.string().optional(),
});

/**
 * Validate request body against schema
 */
export function validateBody<T>(schema: z.ZodSchema<T>) {
  return (req: any, res: any, next: any) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        return res.status(400).json({
          success: false,
          error: {
            message: 'Validation failed',
            code: 'VALIDATION_ERROR',
            details: errors,
          },
        });
      }
      next(error);
    }
  };
}
