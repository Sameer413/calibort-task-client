"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signUpSchema, SignUpSchemaType } from "@/lib/validationSchema";
import { useSignUpRequestMutation } from "@/store/features/authApi";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";

const SignUpPage = () => {
  const [signUpHandler, { isLoading, isSuccess }] = useSignUpRequestMutation();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignUpSchemaType>({
    resolver: zodResolver(signUpSchema),
  });

  const singUpSubmit = async (data: SignUpSchemaType) => {
    try {
      const { data: respData } = await signUpHandler({
        name: data.name,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });

      if (respData.success === true) {
        router.replace("/login");
        reset();
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message || "Login failed");
      } else {
        alert("Sign Up failed");
      }
    }
  };

  return (
    <div className="h-full flex items-center justify-center">
      <div className="w-1/3 mx-auto shadow-md h-2/3 p-6 rounded-md flex flex-col items-center">
        <div className="my-6 text-center text-3xl font-semibold">Sign Up</div>

        <form
          onSubmit={handleSubmit(singUpSubmit)}
          className="flex flex-col gap-3 w-full"
        >
          <Input
            placeholder="Full Name"
            type="text"
            disabled={isLoading}
            {...register("name")}
            aria-label="Full Name"
          />
          {errors.name && (
            <div className="text-sm text-red-500 font-medium">
              {errors.name.message}
            </div>
          )}

          <Input
            placeholder="Email"
            type="email"
            disabled={isLoading}
            {...register("email")}
            aria-label="Email address"
          />
          {errors.email && (
            <div className="text-sm text-red-500 font-medium">
              {errors.email.message}
            </div>
          )}

          <Input
            placeholder="Password"
            type="password"
            disabled={isLoading}
            {...register("password")}
            aria-label="Password"
          />
          {errors.password && (
            <div className="text-sm text-red-500 font-medium">
              {errors.password.message}
            </div>
          )}

          <Input
            placeholder="Confirm Password"
            type="password"
            disabled={isLoading}
            {...register("confirmPassword")}
            aria-label="Confirm Password"
          />
          {errors.confirmPassword && (
            <div className="text-sm text-red-500 font-medium">
              {errors.confirmPassword.message}
            </div>
          )}
          <Button disabled={isLoading} className="mt-6 cursor-pointer">
            Sign Up
          </Button>
        </form>

        <div className="mt-3 font-medium">
          Already have an account?{" "}
          <Link href={"/login"} className="text-blue-500 hover:underline">
            sign-in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
