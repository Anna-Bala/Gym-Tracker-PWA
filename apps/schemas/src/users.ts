import { z } from "zod";

const PasswordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .max(100, { message: "Password must not exceed 100 characters" })
  .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
  .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
  .regex(/\d/, { message: "Password must contain at least one number" })
  .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" });

export const UserPersonalInfoSchema = z.object({
  firstName: z.string().trim().min(2, { message: "First name must be at least 2 characters long" }).max(50, { message: "First name must not exceed 50 characters" }),
  lastName: z.string().trim().min(2, { message: "Last name must be at least 2 characters long" }).max(50, { message: "Last name must not exceed 50 characters" }),
  email: z.email({ message: "Invalid email address" }),
});

export const UserThemeSchema = z.object({
  theme: z.enum(["light", "dark"]),
});

export const SignupSchema = UserPersonalInfoSchema.extend({
  confirmPassword: z.string(),
  password: PasswordSchema,
}).superRefine((data, ctx) => {
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      path: ["confirmPassword"],
      message: "Passwords do not match",
      code: "custom",
    });
  }
});
z;

export const LoginSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z.string().trim().min(1, { message: "Password is required" }),
});

export const ChangePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: PasswordSchema,
});

export const ChangePasswordWithConfirmationSchema = ChangePasswordSchema.extend({
  confirmNewPassword: z.string(),
}).superRefine((data, ctx) => {
  if (data.newPassword !== data.confirmNewPassword) {
    ctx.addIssue({
      path: ["confirmNewPassword"],
      message: "Passwords do not match",
      code: "custom",
    });
  }
});

export type User = z.infer<typeof UserPersonalInfoSchema> & {
  id: number;
  createdAt: string;
  updatedAt: string;
};
