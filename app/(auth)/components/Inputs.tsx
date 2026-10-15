"use client";

import * as React from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { FieldValues, FieldPath, UseFormReturn } from "react-hook-form";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
};

interface FormFieldProps<TFieldValues extends FieldValues> {
  name: FieldPath<TFieldValues>;
  form: UseFormReturn<TFieldValues>;
  label: string;
  placeholder: string;
  type?: string;
  className?: string;
}

export const CustomButton = ({
  label,
  className = "",
  type = "submit",
  ...props
}: {
  label: string | React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
}) => {
  return (
    <Button
      type={type}
      className={`!mt-0 w-full h-14 cursor-pointer bg-[#41B63E] hover:bg-[#36a137] text-white rounded-[30px] ${className}`}
      {...props}
    >
      {label}
    </Button>
  );
};

export const GoogleButton = ({
  label = "Continue with Google",
  className = "",
}: {
  label: string | React.ReactNode;
  className?: string;
}) => {
  return (
    <CustomButton
      type="button"
      className={`bg-white border border-gray-300 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors ${className}`}
      label={
        <>
          <img src="/google.svg" alt="Google Icon" className="w-5 h-5" />

          <span className="text-gray-700 font-semibold text-[18px] leading-[100%] tracking-[0%] capitalize">
            {label}
          </span>
        </>
      }
      // onClick={handleGoogleSignIn} // Uncomment and implement this function to handle Google sign-in
      {...(label && { "aria-label": label })}
    />
  );
};

export const PhoneNumberInput = ({
  label,
  placeholder = "",
  required = false,
  className = "",
}: {
  label: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
}) => {
  return (
    <div className={`flex flex-col ${className}`}>
      <label className="text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type="tel"
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        required={required}
      />
    </div>
  );
};

const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "password", ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    return (
      <div className="relative">
        <Input
          ref={ref}
          type={showPassword ? "text" : type}
          className={cn(
            "pr-10",
            "w-full h-[52px] text-black rounded-[30px] border-2 border-blue-800 focus:border-green-500 focus:ring-0",
            className
          )}
          {...props}
        />
        <div
          //   type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-4 top-[25%] flex items-center text-gray-500 p-0 m-0"
        >
          {showPassword ? (
            <EyeOffIcon className="w-5 h-5" />
          ) : (
            <EyeIcon className="w-5 h-5" />
          )}
        </div>
      </div>
    );
  }
);

export function CustomFormField<TFieldValues extends FieldValues>({
  name,
  form,
  label,
  placeholder,
  type = "text",
  className = "",
}: FormFieldProps<TFieldValues>) {
  const isPasswordField = type === "password";

  return (
    <div className={`relative flex flex-col ${name}`}>
      <FormField
        name={name}
        control={form.control}
        render={({ field }) => (
          <FormItem className="flex flex-col gap-0 pt-2">
            {form.formState.errors[name] && (
              <FormLabel className="text-[10px] absolute left-8 top-0.5 bg-white rounded-2xl px-1.5">
                {label}
              </FormLabel>
            )}
            <FormControl>
              {isPasswordField ? (
                <PasswordInput
                  placeholder={placeholder}
                  className={`w-full h-[52px] text-black rounded-[30px] border-2 border-blue-800 focus:border-green-500 focus:ring-0 ${className}`}
                  {...form.register(name)}
                  // {...field}
                />
              ) : (
                <Input
                  placeholder={placeholder}
                  type={type}
                  className={`w-full h-[52px] text-black rounded-[30px] border-2 border-blue-800 focus:border-green-500 focus:ring-0 ${className}`}
                  {...form.register(name)}
                  // {...field}
                />
              )}
            </FormControl>
            <FormMessage className="pl-4 text-sm" />
          </FormItem>
        )}
      />
    </div>
  );
}
