import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, "The username must be at least 3 characters long")
    .regex(/^\S*$/, "Username must not contain spaces"),
  email: z.string().email("Invalid email address"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
});
