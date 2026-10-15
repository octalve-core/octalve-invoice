"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import React from "react";
import {
  CustomFormField,
  GoogleButton,
  CustomButton,
} from "../components/Inputs";
import { LineThroghText } from "../components/LineThroghText";
import { BottomText } from "../components/BottomText";
import { AuthHeaderText } from "../components/AuthHeaderText";
import Link from "next/link";
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
      message: "Phone Number must start with a plus or contain only digits",
    }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type FormValues = z.infer<typeof validationSchema>;

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);

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

  const onSubmit = (values: FormValues) => {
    console.log(values);

    toast(
      <div>
        <p className="font-bold">You submitted the following values:</p>
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      </div>
    );
  };

  return (
    <>
      <div className="smallScreen justify-center self-center">
        <AuthHeaderText
          title="Create Account"
          className="mb-5"
          subText={
            <>
              It takes less than a minute to create an account. Already have an
              account?{" "}
              <Link className="text-blue-400" href={"/login"}>
                {" "}
                Sign in instead.
              </Link>
            </>
          }
        />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="max-w-[500px] w-full space-y-5 flex flex-col gap-5 self-center"
          >
            <CustomFormField
              name="firstName"
              form={form}
              label="First Name"
              placeholder="Enter your first name"
              className="mt-1"
            />

            <CustomFormField
              name="lastName"
              form={form}
              label="Last Name"
              placeholder="Enter your last name"
              className="mt-1"
            />

            <CustomFormField
              name="email"
              form={form}
              label="Email"
              placeholder="Enter your email"
              type="email"
              className="mt-1"
            />
            <CustomFormField
              name="phoneNumber"
              form={form}
              label="Phone Number"
              placeholder="Enter your phone number"
              type="text"
              className="mt-1"
            />
            <CustomFormField
              name="password"
              form={form}
              label="Password"
              placeholder="Enter your password"
              type="password"
              className="mt-3"
            />

            <CustomButton label="Create Account" />
          </form>
        </Form>

        <LineThroghText
          text="Or"
          className="mt-5 mb-4 max-w-[500px] self-center"
        />

        <GoogleButton
          label="Continue with Google"
          className="mb-10 max-w-[500px] w-full self-center"
        />

        <BottomText />
      </div>

      <div className="largeScreen grid grid-cols-[4fr_3fr] h-screen">
        {/* Left Side */}
        <div className="border-4 w-full flex flex-col justify-center items-center bg-white px-8 py-16">
          <div className="w-full max-w-lg">
            <GoBackText />

            <div className="mb-10">
              <img src="/logo.svg" alt="Finzefy Logo" className="h-10 mb-2" />
              <h2 className="text-2xl font-semibold text-gray-700">
                Create an account
              </h2>
            </div>

            <form className="space-y-6">
              <input
                type="text"
                placeholder="Enter your name"
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="email"
                placeholder="Enter email"
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="tel"
                placeholder="Enter your Phone number"
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  className="block w-full px-4 py-2 pr-16 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-2.5 right-4 text-sm text-gray-600"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
                <p className="text-xs text-gray-500 mt-1">
                  Must be at least 8 characters.
                </p>
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
              >
                Sign up
              </button>
              <p className="text-center text-sm text-gray-500">
                Already have an account?{" "}
                <a href="#" className="text-green-600 hover:underline">
                  Log in
                </a>
              </p>
              <p className="text-xs text-center text-gray-400 mt-4">
                By Proceeding, you agree to Sen-orient{" "}
                <a href="#" className="underline">
                  Terms of services
                </a>{" "}
                and{" "}
                <a href="#" className="underline">
                  policy privacy
                </a>
              </p>
            </form>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex w-full bg-gray-50 items-center justify-center relative">
          <img
            src="/signupBg.jpg"
            alt="Sign Up Background"
            className="object-cover h-full rounded-md"
          />

          <div className="absolute top-[20%] left-[20%] bg-white shadow-lg px-3 py-1 rounded-md text-xs">
            Invoice
          </div>
          <div className="absolute top-[25%] left-[22%] bg-purple-500 text-white shadow-lg px-3 py-1 rounded-md text-xs">
            Expenses
          </div>
          <div className="absolute top-[35%] right-[10%] bg-green-500 text-white shadow-lg px-3 py-1 rounded-md text-xs">
            Receipt
          </div>
          <div className="absolute bottom-[40%] left-[20%] bg-yellow-400 shadow px-3 py-1 rounded-md text-xs">
            Invoice
          </div>
          <div className="absolute bottom-[20%] right-[6%] bg-white text-green-700 shadow px-3 py-1 rounded-md text-xs">
            Expenses
          </div>
        </div>
      </div>
    </>
  );
}
