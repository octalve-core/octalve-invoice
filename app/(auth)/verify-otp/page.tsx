// import React from "react";

// const Loginpage = () => {
//   return (
//     <>
//       <div className="w-[815px] h-[1024px] relative bg-white overflow-hidden">
//         <div className="w-3 h-[791px] left-[803px] top-0 absolute bg-[#40b53e]" />

//         <div className="w-[555px] left-[113px] top-[257.01px] absolute inline-flex flex-col justify-start items-center gap-8">
//           <div className="self-stretch flex flex-col justify-start items-center gap-6">
//             <img
//               className="w-[147px] h-[52.99px]"
//               src="https://placehold.co/147x53"
//               alt="Logo"
//             />
//             <div className="self-stretch flex flex-col justify-start items-start gap-3">
//               <div className="self-stretch text-center justify-start text-[#1d2838] text-2xl font-semibold font-['Montserrat'] leading-[38px]">
//                 Welcome to Finzefy
//               </div>
//             </div>
//           </div>

//           <div className="self-stretch rounded-xl flex flex-col justify-center items-center gap-6">
//             <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
//               <label className="justify-start text-[#344053] text-sm font-medium font-['Montserrat'] leading-tight">
//                 Email*
//               </label>
//               <div className="self-stretch px-3.5 py-2.5 bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] outline outline-1 outline-offset-[-1px] outline-[#cfd4dc] inline-flex justify-start items-center gap-2 overflow-hidden">
//                 <input
//                   type="email"
//                   placeholder="Enter your email"
//                   className="flex-1 text-[#667084] text-base font-normal font-['Montserrat'] leading-normal outline-none"
//                 />
//               </div>
//             </div>

//             <div className="self-stretch flex flex-col justify-start items-start gap-2.5">
//               <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
//                 <label className="justify-start text-[#344053] text-sm font-medium font-['Montserrat'] leading-tight">
//                   Password*
//                 </label>
//                 <div className="self-stretch px-3.5 py-2.5 bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] outline outline-1 outline-offset-[-1px] outline-[#cfd4dc] inline-flex justify-start items-center gap-2 overflow-hidden">
//                   <input
//                     type="password"
//                     placeholder="Enter your password"
//                     className="flex-1 text-[#667084] text-base font-normal font-['Montserrat'] leading-normal outline-none"
//                   />
//                 </div>
//               </div>
//               <div className="self-stretch text-right text-[#d92c20] text-xs font-medium font-['Montserrat'] leading-[18px]">
//                 Forgot password?
//               </div>
//             </div>
//           </div>

//           <button className="self-stretch px-[18px] py-2.5 bg-[#40b53e] rounded-lg shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] outline outline-offset-[-1px] outline-[#40b53e] inline-flex justify-center items-center gap-2 overflow-hidden">
//             <span className="text-white text-base font-semibold font-['Montserrat'] leading-normal">
//               Log in
//             </span>
//           </button>

//           <div className="self-stretch text-center">
//             <span className="text-[#475466] text-xs font-semibold font-['Montserrat'] leading-[18px]">
//               Don&apos;t have an account?
//             </span>
//             <span className="text-[#40b53e] text-xs font-semibold font-['Montserrat'] leading-[18px]">
//               {" "}
//               Sign up
//             </span>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Loginpage;
"use client";

import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Dropzone from "react-dropzone";
import { cn } from "@/lib/utils";

const validationSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  email: z.string().min(1, { message: "Email is required" }).email({
    message: "Must be a valid email",
  }),
  products: z
    .array(
      z.object({
        file: z.any(),
        name: z.string().min(1, { message: "Product Name is required" }),
        description: z.string().min(1, {
          message: "Product Description is required",
        }),
        price: z.coerce.number(),
      })
    )
    .nonempty({ message: "Product is required" }),
});

type FormValues = z.infer<typeof validationSchema>;

export default function Home() {
  const form = useForm<FormValues>({
    resolver: zodResolver(validationSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      products: [],
    },
  });

  const { fields, append } = useFieldArray({
    name: "products",
    control: form.control,
  });

  const onSubmit = (values: FormValues) => {
    console.log(values);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Form {...form}>
        <form
          action=""
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex-1 max-w-md space-y-5"
        >
          <div className="relative name">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your name"
                      type="text"
                      className="mt-3"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="relative email">
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      type="email"
                      className="mt-3"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="relative products">
            <FormField
              control={form.control}
              name="products"
              render={() => (
                <Dropzone
                  accept={{
                    "image/*": [".jpg", ".jpeg", ".png"],
                  }}
                  multiple={true}
                  maxSize={5000000}
                >
                  {({ getRootProps, getInputProps }) => (
                    <div
                      {...getRootProps({
                        className: cn(
                          "p-3 mb-4 flex flex-col items-center justify-center w-full rounded-md cursor-pointer border border-[#e2e8f0]"
                        ),
                      })}
                    >
                      <div className="flex items-center gap-x-3 mt-2 mb-2">
                        <label
                          htmlFor="Products"
                          className={`text-sm text-[7E8DA0] cursor-pointer focus:outline-none focus:underline ${
                            form.formState.errors.products && "text-red-500"
                          }`}
                        >
                          Add your Product Images
                          <input {...getInputProps()} />
                        </label>
                      </div>
                    </div>
                  )}
                </Dropzone>
              )}
            />
          </div>
          <Button type="submit" className="!mt-0 w-full">
            Add
          </Button>
        </form>
      </Form>
    </div>
  );
}
