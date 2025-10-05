import { z } from "zod";

export const SignupSchema = z
  .object({
    firstName: z.string().trim().min(2, { message: "First name must be at least 2 characters long" }).max(50, { message: "First name must not exceed 50 characters" }),
    lastName: z.string().trim().min(2, { message: "Last name must be at least 2 characters long" }).max(50, { message: "Last name must not exceed 50 characters" }),
    email: z.email({ message: "Invalid email address" }),
    confirmPassword: z.string(),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .max(100, { message: "Password must not exceed 100 characters" })
      .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
      .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
      .regex(/\d/, { message: "Password must contain at least one number" })
      .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" }),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        path: ["confirmPassword"],
        message: "Passwords do not match",
        code: "custom",
      });
    }
  });

export const LoginSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z.string().trim().min(1, { message: "Password is required" }),
});
