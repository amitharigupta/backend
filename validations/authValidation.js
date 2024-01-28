import vine from '@vinejs/vine';
import { CustomErrorReporter } from './CustomerErrorReporter.js';

// Custom Error Reporter
vine.errorReporter = () => new CustomErrorReporter();

export const registerSchema = vine.object({
    name: vine.string().minLength(2).maxLength(50),
    email: vine.string().email().minLength(4).maxLength(30),
    password: vine.string().minLength(6).maxLength(50).confirmed(),
    gender: vine.boolean(),
    profile: vine.string().maxLength(500)
});

export const loginSchema = vine.object({
    email: vine.string().email(),
    password: vine.string()
})