import z from "zod";

const AvatarSchema = z.object({
  url: z.string().url(),
  alt: z.string(),
});

export const UpdateUserSchema = z.object({
  avatar: AvatarSchema,
  bio: z.string().optional(),
  venueManager: z.boolean().default(false),
});

export type UpdateUserType = z.infer<typeof UpdateUserSchema>;
