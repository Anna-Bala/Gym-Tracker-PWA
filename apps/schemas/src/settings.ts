import { z } from "zod";

export const ProfileSettingsSchema = z.object({
  firstName: z.string().trim().min(2, { message: "First name must be at least 2 characters long" }).max(50, { message: "First name must not exceed 50 characters" }),
  lastName: z.string().trim().min(2, { message: "Last name must be at least 2 characters long" }).max(50, { message: "Last name must not exceed 50 characters" }),
  email: z.email({ message: "Invalid email address" }),
});
