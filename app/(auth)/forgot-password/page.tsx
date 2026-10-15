"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { GoBackText } from "../components/AuthHeader";
import { SuccessRingIcon } from "../components/SuccessIcon";

const validationSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email({
    message: "Must be a valid email",
  }),
});

type FormValues = z.infer<typeof validationSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(validationSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    console.log(values);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsLoading(false);
    // Navigate to OTP page or check email page
    router.push("/enter-otp");
  };

  return (
    <>
      {/* ==================== MOBILE VIEW ==================== */}
      <div className="smallScreen min-h-[calc(100vh-100px)] justify-center px-4">
        <div className="min-h-full w-full flex flex-col justify-start pt-8 self-center max-w-md mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-bold text-[28px] text-[#2D2D2D] mb-3">
              Forgot Password
            </h1>
            <p className="text-[14px] text-[#7F7F7F] leading-relaxed">
              Enter your account email to receive a recovery link. Please enter
              your email. If an account with your email exists, you&apos;ll
              receive a reset link.
            </p>
          </div>

          {/* Form */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-6 flex flex-col"
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
                  "Continue"
                )}
              </button>
            </form>
          </Form>
        </div>
      </div>

      {/* ==================== DESKTOP VIEW ==================== */}
      <div className="largeScreen">
        <div className="min-h-screen w-full flex items-center justify-center relative">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src="/loginBg.jpg"
              alt="Background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/10" />
          </div>

          {/* Modal */}
          <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 animate-fade-in-up">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <SuccessRingIcon size="lg" />
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-center text-[#1D2838] mb-4">
              Forgot password?
            </h2>

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
                        Email
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
                    "Next"
                  )}
                </button>
              </form>
            </Form>

            {/* Back to Login */}
            <p className="text-center text-sm text-gray-500 mt-6">
              Remember your password?{" "}
              <Link
                href="/login"
                className="text-[#41B63E] hover:underline font-medium"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
