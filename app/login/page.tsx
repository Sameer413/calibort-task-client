"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppDispatch } from "@/hooks/redux-hook";
import { signInSchema, SignInSchemaType } from "@/lib/validationSchema";
import { useLoginRequestMutation } from "@/store/features/authApi";
import { login } from "@/store/features/userSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";

const LoginPage = () => {
  const dispatch = useAppDispatch();

  const [loginHandler, { isLoading }] = useLoginRequestMutation();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignInSchemaType>({
    resolver: zodResolver(signInSchema),
  });

  const loginSubmit = async (data: SignInSchemaType) => {
    try {
      const { data: responseData } = await loginHandler({
        email: data.email,
        password: data.password,
      });

      dispatch(
        login({
          user: responseData.user,
          isAuthenticated: true,
        })
      );

      router.replace("/profile");
      reset();
    } catch (err: any) {
      alert(err.message || "Login failed");
    }
  };

  return (
    <div className="h-full flex items-center justify-center">
      <div className="w-1/3 mx-auto shadow-md h-2/3 p-6 rounded-md flex flex-col items-center">
        <div className="my-6 text-center text-3xl font-semibold">Sign In</div>
        <form
          onSubmit={handleSubmit(loginSubmit)}
          className="flex flex-col gap-3 w-full"
        >
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
          <Button disabled={isLoading} className="mt-6 cursor-pointer">
            Sign In
          </Button>
        </form>
        <div className="mt-3 font-medium">
          Don't have account?{" "}
          <Link href={"/sign-up"} className="text-blue-500 hover:underline">
            sign-up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
