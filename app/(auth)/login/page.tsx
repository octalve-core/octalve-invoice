"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import React from "react";
import Link from "next/link";
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { GoBackText } from "../components/AuthHeader";

const validationSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email({
    message: "Must be a valid email",
  }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type FormValues = z.infer<typeof validationSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(validationSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    console.log(values);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    toast.success("Login successful!");
    setIsLoading(false);
  };

  return (
    <>
      {/* ==================== MOBILE VIEW ==================== */}
      <div className="smallScreen min-h-[calc(100vh-100px)] h-[calc(100%-100px)] justify-center px-4">
        <div className="min-h-full w-full flex flex-col justify-center self-center max-w-md mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-bold text-[28px] text-[#2D2D2D] mb-2">
              Log in
            </h1>
            <p className="text-[16px] text-[#7F7F7F]">You are welcome back.</p>
          </div>

          {/* Form */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-5 flex flex-col"
            >
              {/* Email Input */}
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <input
                        {...field}
                        type="email"
                        placeholder="Email"
                        className={`auth-input ${
                          form.formState.errors.email ? "error" : ""
                        } ${field.value ? "filled" : ""}`}
                      />
                    </FormControl>
                    <FormMessage className="pl-4 text-sm text-red-500" />
                  </FormItem>
                )}
              />

              {/* Password Input */}
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          className={`auth-input pr-12 ${
                            form.formState.errors.password ? "error" : ""
                          } ${field.value ? "filled" : ""}`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPassword ? (
                            <EyeOffIcon className="w-5 h-5" />
                          ) : (
                            <EyeIcon className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="pl-4 text-sm text-red-500" />
                  </FormItem>
                )}
              />

              {/* Forgot Password Link */}
              <div className="text-right">
                <Link
                  href="/forgot-password"
                  className="text-[#41B63E] text-sm font-medium hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="auth-btn flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Loading
                  </>
                ) : (
                  "Log In"
                )}
              </button>
            </form>
          </Form>

          {/* Divider */}
          <div className="auth-divider my-6">
            <span>Or</span>
          </div>

          {/* Google Button */}
          <button className="auth-btn-outline flex items-center justify-center gap-3">
            <img src="/google.svg" alt="Google" className="w-5 h-5" />
            <span className="font-medium">Continue With Google</span>
          </button>

          {/* Bottom Link */}
          <p className="text-center mt-8 text-[14px] text-[#727475]">
            Have an account?{" "}
            <Link href="/signup" className="text-[#41B63E] font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* ==================== DESKTOP VIEW ==================== */}
      <div className="largeScreen">
        <div className="grid grid-cols-[4fr_3fr] h-screen">
          {/* Left Side - Form */}
          <div className="w-full flex flex-col justify-center items-center bg-white px-8 py-16">
            <div className="w-full max-w-lg">
              <GoBackText />

              {/* Logo and Title */}
              <div className="mb-10">
                <img src="/logo.svg" alt="Finzefy Logo" className="h-12 mb-4" />
                <h2 className="text-2xl font-semibold text-[#1D2838]">
                  Welcome to Finzefy
                </h2>
              </div>

              {/* Form */}
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* Email */}
                  <FormField
                    name="email"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <label className="text-sm font-medium text-[#344053] mb-1.5 block">
                          Email*
                        </label>
                        <FormControl>
                          <input
                            {...field}
                            type="email"
                            placeholder="Enter your email"
                            className="auth-input-gray"
                          />
                        </FormControl>
                        <FormMessage className="text-sm text-red-500" />
                      </FormItem>
                    )}
                  />

                  {/* Password */}
                  <FormField
                    name="password"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <label className="text-sm font-medium text-[#344053] mb-1.5 block">
                          Password*
                        </label>
                        <FormControl>
                          <div className="relative">
                            <input
                              {...field}
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter your password"
                              className="auth-input-gray pr-12"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                              {showPassword ? (
                                <EyeOffIcon className="w-5 h-5" />
                              ) : (
                                <EyeIcon className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <div className="flex justify-end mt-1">
                          <Link
                            href="/forgot-password"
                            className="text-[#D92C20] text-xs font-medium hover:underline"
                          >
                            Forgot password?
                          </Link>
                        </div>
                        <FormMessage className="text-sm text-red-500" />
                      </FormItem>
                    )}
                  />

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#41B63E] hover:bg-[#36a137] text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Loading
                      </>
                    ) : (
                      "Log in"
                    )}
                  </button>

                  {/* Bottom Link */}
                  <p className="text-center text-sm text-gray-500">
                    Don&apos;t have an account?{" "}
                    <Link
                      href="/signup"
                      className="text-[#41B63E] hover:underline font-medium"
                    >
                      Sign up
                    </Link>
                  </p>
                </form>
              </Form>
            </div>
          </div>

          {/* Right Side - Hero Image */}
          <div className="relative overflow-hidden">
            <img
              src="/loginBg.jpg"
              alt="Hero Background"
              className="w-full h-full object-cover"
            />

            {/* Floating Badges */}
            <div className="absolute top-[12%] left-[15%] bg-white shadow-lg px-4 py-2 rounded-xl text-sm flex items-center gap-2 animate-float-slow">
              <img src="/invoiceIcon.svg" alt="" className="w-6 h-6" />
              Invoice
            </div>
            <div className="absolute top-[8%] right-[10%] bg-purple-100 text-purple-600 shadow-lg px-4 py-2 rounded-xl text-sm font-medium animate-float-delayed">
              Expenses
            </div>
            <div className="absolute top-[40%] right-[5%] bg-[#41B63E] text-white shadow-lg px-4 py-2 rounded-xl text-sm font-medium animate-float">
              Receipt
            </div>
            <div className="absolute bottom-[35%] left-[15%] bg-yellow-400 text-gray-800 shadow-lg px-4 py-2 rounded-xl text-sm font-medium animate-float-slow">
              Invoice
            </div>
            <div className="absolute bottom-[12%] right-[8%] bg-white text-[#41B63E] shadow-lg px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 animate-float-delayed">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                <path
                  fillRule="evenodd"
                  d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                  clipRule="evenodd"
                />
              </svg>
              Expenses
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
