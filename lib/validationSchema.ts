import { z } from "zod";

export const signUpSchema = z
    .object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email("Invalid email"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export type SignUpSchemaType = z.infer<typeof signUpSchema>;

export const signInSchema = z
    .object({
        email: z.string().email("Invalid email"),
        password: z.string().min(6, "Password must be at least 6 characters"),
    })

export type SignInSchemaType = z.infer<typeof signInSchema>;