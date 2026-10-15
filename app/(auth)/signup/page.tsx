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
  firstName: z.string().min(1, { message: "First Name is required" }),
  lastName: z.string().min(1, { message: "Last Name is required" }),
  email: z.string().min(1, { message: "Email is required" }).email({
    message: "Must be a valid email",
  }),
  phoneNumber: z
    .string()
    .min(10, { message: "Phone Number must be at least 10 digits" })
    .regex(/^\+?\d+$/, {
      message: "Phone Number must contain only digits",
    }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

type FormValues = z.infer<typeof validationSchema>;

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(validationSchema),
    mode: "onBlur",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    console.log(values);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    toast.success("Account created successfully!");
    setIsLoading(false);
  };

  return (
    <>
      {/* ==================== MOBILE VIEW ==================== */}
      <div className="smallScreen min-h-[calc(100vh-100px)] justify-center px-4 py-6">
        <div className="w-full flex flex-col justify-center self-center max-w-md mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="font-bold text-[28px] text-[#2D2D2D] mb-2">
              Create Account
            </h1>
            <p className="text-[14px] text-[#7F7F7F]">
              It takes less than a minute to create an account.
              <br />
              Already have an account?
            </p>
          </div>

          {/* Form */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-4 flex flex-col"
            >
              {/* First Name */}
              <FormField
                name="firstName"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <input
                        {...field}
                        type="text"
                        placeholder="First Name"
                        className={`auth-input ${
                          form.formState.errors.firstName ? "error" : ""
                        } ${field.value ? "filled" : ""}`}
                      />
                    </FormControl>
                    <FormMessage className="pl-4 text-sm text-red-500" />
                  </FormItem>
                )}
              />

              {/* Last Name */}
              <FormField
                name="lastName"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <input
                        {...field}
                        type="text"
                        placeholder="Last Name"
                        className={`auth-input ${
                          form.formState.errors.lastName ? "error" : ""
                        } ${field.value ? "filled" : ""}`}
                      />
                    </FormControl>
                    <FormMessage className="pl-4 text-sm text-red-500" />
                  </FormItem>
                )}
              />

              {/* Email */}
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

              {/* Phone Number with Country Code */}
              <FormField
                name="phoneNumber"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex gap-2">
                        {/* Country Code Selector */}
                        <div className="flex items-center gap-2 px-4 h-[52px] rounded-[30px] border-2 border-[#2563EB] bg-white min-w-[100px]">
                          <span className="text-lg">🇳🇬</span>
                          <span className="text-gray-700 text-sm">+234</span>
                          <svg
                            className="w-4 h-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                        {/* Phone Input */}
                        <input
                          {...field}
                          type="tel"
                          placeholder="Phone Number"
                          className={`auth-input flex-1 ${
                            form.formState.errors.phoneNumber ? "error" : ""
                          } ${field.value ? "filled" : ""}`}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="pl-4 text-sm text-red-500" />
                  </FormItem>
                )}
              />

              {/* Password */}
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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="auth-btn flex items-center justify-center gap-2 mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Loading
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>
          </Form>

          {/* Divider */}
          <div className="auth-divider my-5">
            <span>Or</span>
          </div>

          {/* Google Button */}
          <button className="auth-btn-outline flex items-center justify-center gap-3">
            <img src="/google.svg" alt="Google" className="w-5 h-5" />
            <span className="font-medium">Continue With Google</span>
          </button>

          {/* Bottom Link */}
          <p className="text-center mt-6 text-[14px] text-[#727475]">
            Have an account?{" "}
            <Link href="/login" className="text-[#41B63E] font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* ==================== DESKTOP VIEW ==================== */}
      <div className="largeScreen">
        <div className="grid grid-cols-[4fr_3fr] h-screen">
          {/* Left Side - Form */}
          <div className="w-full flex flex-col justify-center items-center bg-white px-8 py-12 overflow-y-auto">
            <div className="w-full max-w-lg">
              <GoBackText />

              {/* Logo and Title */}
              <div className="mb-8">
                <img src="/logo.svg" alt="Finzefy Logo" className="h-12 mb-4" />
                <h2 className="text-2xl font-semibold text-[#1D2838]">
                  Create an account
                </h2>
              </div>

              {/* Form */}
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-5"
                >
                  {/* Name Field */}
                  <FormField
                    name="firstName"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <label className="text-sm font-medium text-[#344053] mb-1.5 block">
                          Name*
                        </label>
                        <FormControl>
                          <input
                            {...field}
                            type="text"
                            placeholder="Enter your name"
                            className="auth-input-gray"
                          />
                        </FormControl>
                        <FormMessage className="text-sm text-red-500" />
                      </FormItem>
                    )}
                  />

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
                            placeholder="Enter email"
                            className="auth-input-gray"
                          />
                        </FormControl>
                        <FormMessage className="text-sm text-red-500" />
                      </FormItem>
                    )}
                  />

                  {/* Phone Number */}
                  <FormField
                    name="phoneNumber"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <label className="text-sm font-medium text-[#344053] mb-1.5 block">
                          Phone number*
                        </label>
                        <FormControl>
                          <input
                            {...field}
                            type="tel"
                            placeholder="Enter your Phone number"
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
                              placeholder="Create a password"
                              className="auth-input-gray pr-16"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-600 hover:text-gray-800"
                            >
                              {showPassword ? "Hide" : "Show"}
                            </button>
                          </div>
                        </FormControl>
                        <p className="text-xs text-gray-500 mt-1">
                          Must be at least 8 characters.
                        </p>
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
                      "Sign up"
                    )}
                  </button>

                  {/* Bottom Link */}
                  <p className="text-center text-sm text-gray-500">
                    Already have an account?{" "}
                    <Link
                      href="/login"
                      className="text-[#41B63E] hover:underline font-medium"
                    >
                      Log in
                    </Link>
                  </p>

                  {/* Terms */}
                  <p className="text-xs text-center text-gray-400 mt-4">
                    By Proceeding, you agree to Sen-orient{" "}
                    <Link href="#" className="underline hover:text-gray-600">
                      Terms of services
                    </Link>{" "}
                    and{" "}
                    <Link href="#" className="underline hover:text-gray-600">
                      policy privacy
                    </Link>
                  </p>
                </form>
              </Form>
            </div>
          </div>

          {/* Right Side - Hero Image */}
          <div className="relative overflow-hidden">
            <img
              src="/signupBg.jpg"
              alt="Hero Background"
              className="w-full h-full object-cover"
            />

            {/* Floating Badges */}
            <div className="absolute top-[10%] left-[18%] bg-white shadow-lg px-4 py-2 rounded-xl text-sm flex items-center gap-2 animate-float-slow">
              <img src="/invoiceIcon.svg" alt="" className="w-6 h-6" />
              Invoice
            </div>
            <div className="absolute top-[6%] right-[8%] bg-purple-100 text-purple-600 shadow-lg px-4 py-2 rounded-xl text-sm font-medium animate-float-delayed">
              Expenses
            </div>
            <div className="absolute top-[30%] right-[12%] bg-[#41B63E] text-white shadow-lg px-4 py-2 rounded-xl text-sm font-medium animate-float">
              Receipt
            </div>
            <div className="absolute bottom-[40%] left-[10%] bg-yellow-400 text-gray-800 shadow-lg px-4 py-2 rounded-xl text-sm font-medium animate-float-slow">
              Invoice
            </div>
            <div className="absolute bottom-[15%] right-[6%] bg-white text-[#41B63E] shadow-lg px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 animate-float-delayed">
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
