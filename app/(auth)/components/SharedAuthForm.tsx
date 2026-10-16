"use client";
import {useState} from "react";
import Link from "next/link";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "sonner";
import {Eye,EyeOff,LockKeyhole} from "lucide-react";
import {Form,FormControl,FormField,FormItem,FormMessage} from "@/components/ui/form";

const fieldsSchema=z.object({
 firstName:z.string(),lastName:z.string(),email:z.string().min(1,"Email is required").email("Enter a valid email"),
 phoneNumber:z.string(),password:z.string().min(6,"Password must be at least 6 characters")
});
type Values=z.infer<typeof fieldsSchema>;
const loginSchema=fieldsSchema;
const signupSchema=fieldsSchema.superRefine((v,ctx)=>{
 if(!v.firstName.trim())ctx.addIssue({code:"custom",path:["firstName"],message:"First name is required"});
 if(!v.lastName.trim())ctx.addIssue({code:"custom",path:["lastName"],message:"Last name is required"});
 if(!/^(?:\+234|0)[789]\d{9}$/.test(v.phoneNumber.replace(/[\s()-]/g,"")))ctx.addIssue({code:"custom",path:["phoneNumber"],message:"Enter a valid Nigerian mobile number (e.g. 08012345678)"});
 if(v.password.length<8)ctx.addIssue({code:"custom",path:["password"],message:"Password must be at least 8 characters"});
});
export function SharedAuthForm({mode}:{mode:"login"|"signup"}){
 const signup=mode==="signup";
 const [visible,setVisible]=useState(false);
 const form=useForm<Values>({
  resolver:zodResolver(signup?signupSchema:loginSchema),
  mode:"onBlur",
  defaultValues:{firstName:"",lastName:"",email:"",phoneNumber:"",password:""}
 });
 const blocked=()=>{
  // Do not transmit any credentials, store form values or fake an authenticated session.
  toast.info("Account access will be available after secure sign-in is connected.");
 };
 const cls="auth-input w-full min-w-0 border border-[#DFE9F6] bg-white text-[#183955] focus-visible:outline-2 focus-visible:outline-[#0064E0] lg:rounded-xl";
 const input=(name:"firstName"|"lastName"|"email"|"phoneNumber",label:string,type="text",autoComplete="off")=><FormField control={form.control} name={name} render={({field})=><FormItem>
  <label htmlFor={"octalve-"+name} className="mb-1.5 block text-xs font-semibold text-[#415873]">{label}</label>
  <FormControl><input {...field} id={"octalve-"+name} type={type} autoComplete={autoComplete} placeholder={label} aria-invalid={Boolean(form.formState.errors[name])} className={cls}/></FormControl>
  <FormMessage className="mt-1 px-2 text-xs text-red-600"/>
 </FormItem>}/>;
 return <div className="w-full">
   <Form {...form}>
    <form onSubmit={form.handleSubmit(blocked)} className="space-y-4" noValidate>
      {signup?<div className="grid gap-4 sm:grid-cols-2">{input("firstName","First name","text","given-name")}{input("lastName","Last name","text","family-name")}</div>:null}
      {input("email","Email address","email","email")}
      {signup?input("phoneNumber","Phone number","tel","tel"):null}
      <FormField control={form.control} name="password" render={({field})=><FormItem>
       <div className="flex items-center justify-between gap-3"><label htmlFor="octalve-password" className="text-xs font-semibold text-[#415873]">Password</label>{!signup?<Link href="/forgot-password" className="text-xs font-semibold text-[#0064E0] hover:underline">Forgot password?</Link>:null}</div>
       <FormControl><div className="relative"><input {...field} id="octalve-password" type={visible?"text":"password"} autoComplete={signup?"new-password":"current-password"} aria-invalid={Boolean(form.formState.errors.password)} placeholder={signup?"Create a password":"Enter your password"} className={cls+" pr-12"}/>
        <button type="button" onClick={()=>setVisible(x=>!x)} aria-label={visible?"Hide password":"Show password"} aria-pressed={visible} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-[#63798F] hover:bg-blue-50">{visible?<EyeOff size={18}/>:<Eye size={18}/>}</button>
       </div></FormControl>
       {signup?<p className="px-2 text-[11px] text-slate-500">At least 8 characters. Use a strong, unique password.</p>:null}
       <FormMessage className="mt-1 px-2 text-xs text-red-600"/>
      </FormItem>}/>
      <button type="submit" className="mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0064E0] px-4 text-sm font-bold text-white transition-colors hover:bg-[#0052B8]"><LockKeyhole size={16}/>{signup?"Create account":"Log in"}</button>
    </form>
   </Form>
   <div className="my-5 flex items-center gap-3 text-xs text-[#9BA9BB]"><span className="h-px flex-1 bg-[#E8EEF6]"/>Or<span className="h-px flex-1 bg-[#E8EEF6]"/></div>
   <button type="button" onClick={()=>toast.info("Google sign-in will be available after verified OAuth integration.")} className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-[#DDE7F3] bg-white px-4 text-sm font-semibold text-[#294660] hover:bg-[#F5F9FF]"><img src="/google.svg" alt="" className="h-5 w-5"/>Continue with Google</button>
   <p className="mt-6 text-center text-sm text-[#75869A]">{signup?"Already have an account?":"New to Octalve?"}{" "}<Link href={signup?"/login":"/signup"} className="font-semibold text-[#0064E0] hover:underline">{signup?"Log in":"Create an account"}</Link></p>
   <p className="mt-4 text-center text-[11px] leading-5 text-[#90A0B1]">Your details are never submitted while the secure authentication service is unavailable.</p>
  </div>;
}
