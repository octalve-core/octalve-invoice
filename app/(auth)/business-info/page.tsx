"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Camera, Upload } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

const validationSchema = z.object({
  businessName: z.string().min(1, { message: "Business name is required" }),
  businessAddress: z
    .string()
    .min(1, { message: "Business address is required" }),
  businessPhone: z.string().min(10, { message: "Phone number is required" }),
  businessDescription: z.string().optional(),
  rcNumber: z.string().optional(),
  taxId: z.string().optional(),
  instagram: z.string().optional(),
  twitter: z.string().optional(),
  facebook: z.string().optional(),
  website: z.string().optional(),
});

type FormValues = z.infer<typeof validationSchema>;

export default function BusinessInfoPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(validationSchema),
    mode: "onBlur",
    defaultValues: {
      businessName: "",
      businessAddress: "",
      businessPhone: "",
      businessDescription: "",
      rcNumber: "",
      taxId: "",
      instagram: "",
      twitter: "",
      facebook: "",
      website: "",
    },
  });

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignaturePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    console.log(values);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsLoading(false);
    router.push("/set-currency");
  };

  const handleSkip = () => {
    router.push("/set-currency");
  };

  return (
    <>
      {/* ==================== MOBILE VIEW ==================== */}
      <div className="smallScreen min-h-screen pb-8">
        <div className="max-w-md mx-auto w-full">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <div className="flex-1 py-3 text-center text-[#41B63E] border-b-2 border-[#41B63E] font-medium text-sm">
              Business Information
            </div>
            <button
              onClick={handleSkip}
              className="px-4 py-3 text-[#41B63E] font-medium text-sm"
            >
              Skip
            </button>
          </div>

          {/* Logo Upload */}
          <div className="flex justify-center mb-6">
            <label className="cursor-pointer">
              <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center relative overflow-hidden">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Camera className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
              />
              <p className="text-center text-xs text-gray-500 mt-2">
                Upload Logo
              </p>
            </label>
          </div>

          {/* Form */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 px-4"
            >
              {/* Business Name */}
              <FormField
                name="businessName"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <label className="text-xs text-gray-500 mb-1 block">
                      Business Name
                    </label>
                    <FormControl>
                      <input
                        {...field}
                        type="text"
                        placeholder="e.g. Weyport Energy Ltd"
                        className="auth-input-gray"
                      />
                    </FormControl>
                    <FormMessage className="text-sm text-red-500" />
                  </FormItem>
                )}
              />

              {/* Business Address */}
              <FormField
                name="businessAddress"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <label className="text-xs text-gray-500 mb-1 block">
                      Business Address
                    </label>
                    <FormControl>
                      <input
                        {...field}
                        type="text"
                        placeholder="e.g. Kofo Abayomi Street, Victoria Island, Lagos."
                        className="auth-input-gray"
                      />
                    </FormControl>
                    <FormMessage className="text-sm text-red-500" />
                  </FormItem>
                )}
              />

              {/* Business Phone */}
              <FormField
                name="businessPhone"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <label className="text-xs text-gray-500 mb-1 block">
                      Business Phone Number
                    </label>
                    <FormControl>
                      <input
                        {...field}
                        type="tel"
                        placeholder="+234 7012345678"
                        className="auth-input-gray"
                      />
                    </FormControl>
                    <FormMessage className="text-sm text-red-500" />
                  </FormItem>
                )}
              />

              {/* Business Description */}
              <FormField
                name="businessDescription"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <label className="text-xs text-gray-500 mb-1 block">
                      Business Description
                    </label>
                    <FormControl>
                      <textarea
                        {...field}
                        placeholder="Energy Company - Energy for sustainable a tomorrow"
                        rows={3}
                        className="auth-input-gray resize-none h-auto py-3"
                      />
                    </FormControl>
                    <FormMessage className="text-sm text-red-500" />
                  </FormItem>
                )}
              />

              {/* RC Number */}
              <FormField
                name="rcNumber"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <label className="text-xs text-gray-500 mb-1 block">
                      RC Number (Optional)
                    </label>
                    <FormControl>
                      <input
                        {...field}
                        type="text"
                        placeholder="6165256171771"
                        className="auth-input-gray"
                      />
                    </FormControl>
                    <FormMessage className="text-sm text-red-500" />
                  </FormItem>
                )}
              />

              {/* Tax ID */}
              <FormField
                name="taxId"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <label className="text-xs text-gray-500 mb-1 block">
                      Tax ID (Optional)
                    </label>
                    <FormControl>
                      <input
                        {...field}
                        type="text"
                        placeholder="6165256171771"
                        className="auth-input-gray"
                      />
                    </FormControl>
                    <FormMessage className="text-sm text-red-500" />
                  </FormItem>
                )}
              />

              {/* Instagram */}
              <FormField
                name="instagram"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <label className="text-xs text-gray-500 mb-1 block">
                      Instagram Profile Name (Optional)
                    </label>
                    <FormControl>
                      <input
                        {...field}
                        type="text"
                        placeholder="@weyportenergy"
                        className="auth-input-gray"
                      />
                    </FormControl>
                    <FormMessage className="text-sm text-red-500" />
                  </FormItem>
                )}
              />

              {/* Twitter */}
              <FormField
                name="twitter"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <label className="text-xs text-gray-500 mb-1 block">
                      Twitter Profile link (Optional)
                    </label>
                    <FormControl>
                      <input
                        {...field}
                        type="text"
                        placeholder="@weyportenergy"
                        className="auth-input-gray"
                      />
                    </FormControl>
                    <FormMessage className="text-sm text-red-500" />
                  </FormItem>
                )}
              />

              {/* Facebook */}
              <FormField
                name="facebook"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <label className="text-xs text-gray-500 mb-1 block">
                      Facebook Profile link (Optional)
                    </label>
                    <FormControl>
                      <input
                        {...field}
                        type="text"
                        placeholder="@weyportenergy"
                        className="auth-input-gray"
                      />
                    </FormControl>
                    <FormMessage className="text-sm text-red-500" />
                  </FormItem>
                )}
              />

              {/* Website */}
              <FormField
                name="website"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <label className="text-xs text-gray-500 mb-1 block">
                      Website
                    </label>
                    <FormControl>
                      <input
                        {...field}
                        type="url"
                        placeholder="www.weyportenergy.com"
                        className="auth-input-gray"
                      />
                    </FormControl>
                    <FormMessage className="text-sm text-red-500" />
                  </FormItem>
                )}
              />

              {/* Digital Signature */}
              <div>
                <label className="text-xs text-gray-500 mb-2 block">
                  Digital Signature
                </label>
                <label className="cursor-pointer">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
                    {signaturePreview ? (
                      <img
                        src={signaturePreview}
                        alt="Signature"
                        className="max-h-20 mx-auto"
                      />
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-[#41B63E] font-medium">
                          Upload signature
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          SVG, PNG, JPG or GIF (max. 1024x576px)
                        </p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSignatureChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#41B63E] hover:bg-[#36a137] text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 mt-6"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Loading
                  </>
                ) : (
                  "Save"
                )}
              </button>
            </form>
          </Form>
        </div>
      </div>

      {/* ==================== DESKTOP VIEW ==================== */}
      <div className="largeScreen min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-[#1D2838]">
              Business Information
            </h1>
            <button
              onClick={handleSkip}
              className="text-[#41B63E] font-medium hover:underline"
            >
              Skip
            </button>
          </div>

          {/* Logo Upload */}
          <div className="flex justify-center mb-8">
            <label className="cursor-pointer">
              <div className="w-28 h-28 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center relative overflow-hidden hover:bg-gray-50 transition-colors">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Camera className="w-10 h-10 text-gray-400" />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
              />
              <p className="text-center text-sm text-gray-500 mt-2">
                Upload Logo
              </p>
            </label>
          </div>

          {/* Form Grid */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid grid-cols-2 gap-6"
            >
              {/* Business Name - Full Width */}
              <div className="col-span-2">
                <FormField
                  name="businessName"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <label className="text-sm font-medium text-[#344053] mb-1.5 block">
                        Business Name*
                      </label>
                      <FormControl>
                        <input
                          {...field}
                          type="text"
                          placeholder="Weyport Energy Ltd"
                          className="auth-input-gray"
                        />
                      </FormControl>
                      <FormMessage className="text-sm text-red-500" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Business Address - Full Width */}
              <div className="col-span-2">
                <FormField
                  name="businessAddress"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <label className="text-sm font-medium text-[#344053] mb-1.5 block">
                        Business Address*
                      </label>
                      <FormControl>
                        <input
                          {...field}
                          type="text"
                          placeholder="Kofo Abayomi Street, Victoria Island, Lagos."
                          className="auth-input-gray"
                        />
                      </FormControl>
                      <FormMessage className="text-sm text-red-500" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Business Phone */}
              <FormField
                name="businessPhone"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <label className="text-sm font-medium text-[#344053] mb-1.5 block">
                      Business Phone Number*
                    </label>
                    <FormControl>
                      <input
                        {...field}
                        type="tel"
                        placeholder="+234 7012345678"
                        className="auth-input-gray"
                      />
                    </FormControl>
                    <FormMessage className="text-sm text-red-500" />
                  </FormItem>
                )}
              />

              {/* RC Number */}
              <FormField
                name="rcNumber"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <label className="text-sm font-medium text-[#344053] mb-1.5 block">
                      RC Number (Optional)
                    </label>
                    <FormControl>
                      <input
                        {...field}
                        type="text"
                        placeholder="6165256171771"
                        className="auth-input-gray"
                      />
                    </FormControl>
                    <FormMessage className="text-sm text-red-500" />
                  </FormItem>
                )}
              />

              {/* Tax ID */}
              <FormField
                name="taxId"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <label className="text-sm font-medium text-[#344053] mb-1.5 block">
                      Tax ID (Optional)
                    </label>
                    <FormControl>
                      <input
                        {...field}
                        type="text"
                        placeholder="1516525617171"
                        className="auth-input-gray"
                      />
                    </FormControl>
                    <FormMessage className="text-sm text-red-500" />
                  </FormItem>
                )}
              />

              {/* Website */}
              <FormField
                name="website"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <label className="text-sm font-medium text-[#344053] mb-1.5 block">
                      Website
                    </label>
                    <FormControl>
                      <input
                        {...field}
                        type="url"
                        placeholder="www.weyportenergy.com"
                        className="auth-input-gray"
                      />
                    </FormControl>
                    <FormMessage className="text-sm text-red-500" />
                  </FormItem>
                )}
              />

              {/* Business Description - Full Width */}
              <div className="col-span-2">
                <FormField
                  name="businessDescription"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <label className="text-sm font-medium text-[#344053] mb-1.5 block">
                        Business Description
                      </label>
                      <FormControl>
                        <textarea
                          {...field}
                          placeholder="Energy Company - Energy for sustainable a tomorrow"
                          rows={3}
                          className="auth-input-gray resize-none h-auto py-3"
                        />
                      </FormControl>
                      <FormMessage className="text-sm text-red-500" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Digital Signature - Full Width */}
              <div className="col-span-2">
                <label className="text-sm font-medium text-[#344053] mb-2 block">
                  Digital Signature
                </label>
                <label className="cursor-pointer block">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors">
                    {signaturePreview ? (
                      <img
                        src={signaturePreview}
                        alt="Signature"
                        className="max-h-24 mx-auto"
                      />
                    ) : (
                      <>
                        <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-[#41B63E] font-medium">
                          Upload signature
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          SVG, PNG, JPG or GIF (max. 1024x576px)
                        </p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSignatureChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Submit Button - Full Width */}
              <div className="col-span-2">
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
                    "Save"
                  )}
                </button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}
