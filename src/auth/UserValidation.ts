import { z } from "zod";

export const RegisterUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z
    .string()
    .email("Invalid email address")
    .refine((email) => email.endsWith("@stud.noroff.no"), {
      message: "Email must be a stud.noroff.no email address",
    }),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  venueManager: z.boolean().default(false),
});

export type RegisterUserType = z.infer<typeof RegisterUserSchema>;

export const LoginUserSchema = z.object({
  email: z
    .string()
    .email()
    .refine((email) => email.endsWith("@stud.noroff.no"), {
      message: "Email must be a stud.noroff.no email address",
    }),
  password: z.string(),
});

export type LoginType = z.infer<typeof LoginUserSchema>;

API_KEY: "4e529365-1137-49dd-b777-84c28348625f";

export type RegisterUserResponseType = {
  id: string;
  name: string;
  email: string;
  venueManager: boolean;
};

export type LoginResponseType = {
  accessToken: string;
  name: string;
  avatar: {
    url: string;
    alt: string;
  };
  banner: {
    url: string;
    alt: string;
  };
  venueManager: boolean;
};
