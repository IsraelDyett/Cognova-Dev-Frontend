import { z } from "zod";

export const UserSchema = z.object({
  id: z.string().cuid2(),
  name: z.string().nullable(),
  email: z.string().email(),
  password: z.string(),
  roleId: z.string().cuid2().nullable(),
  emailVerified: z.boolean().default(false),
  uplineId: z.string().cuid2().nullable(),
  lastLoggedAt: z.date().nullable(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date(),
});

export const SessionSchema = z.object({
  id: z.string().cuid2(),
  userId: z.string().cuid2(),
  accessToken: z.string(),
  refreshToken: z.string(),
  ipAddress: z.string().nullable(),
  device: z.string().nullable(),
  os: z.string().nullable(),
  browser: z.string().nullable(),
  status: z.string(),
  createdAt: z.date().default(() => new Date()),
  expiresAt: z.date(),
});

export const RoleSchema = z.object({
  id: z.string().cuid2(),
  name: z.string(),
  displayName: z.string(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date(),
});

export const PermissionSchema = z.object({
  id: z.string().cuid2(),
  name: z.string(),
  displayName: z.string(),
  roleId: z.string().cuid2(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date(),
});

export const SignUpSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(32, "Password must be a maximun 32 characters"),
  name: z.string().min(2).nullable().optional(),
  image: z.string().nullable().optional(),
  uplineId: z.string().cuid2().nullable().optional(),
});

export const SignInSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(32, "Password must be a maximun 32 characters"),
});
