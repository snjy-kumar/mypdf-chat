import { z } from 'zod';

export const userNameValidation = z
    .string()
    .min(3, 'Username must be at least 3 characters long')
    .max(12, 'Username must be at most 12 characters long')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username must contain only letters, numbers, and underscores');

export const emailValidation = z
    .string()
    .email({message:'Invalid email address'});


export const passwordValidation = z
    .string()
    .min(6, {message: 'Password must be at least 6 characters long'})
    .max(24, {message: 'Password must be at most 24 characters long'});

export const signUpSchema = z.object({
    username: userNameValidation,
    email: emailValidation,
    password: passwordValidation,
});