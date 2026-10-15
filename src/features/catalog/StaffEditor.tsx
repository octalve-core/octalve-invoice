"use client";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {ArrowLeft,UserRoundCog} from "lucide-react";
import {useMerchantPreview,type CatalogStaff} from "@/src/features/merchant-preview/MerchantPreviewProvider";
export function StaffEditor({editId}:{editId?:string}){
 const router=useRouter(),{staff,setStaff}=useMerchantPreview();
 const initial=editId?staff.find(x=>x.id===editId):undefined;
 const [form,setForm]=useState<CatalogStaff>(()=>initial?{...initial}:{id:"",name:"",email:"",phone:"",role:"Salesperson"});
 const [error,setError]=useState("");
 function save(){
  if(!form.name.trim()||!/^\S+@\S+\.\S+$/.test(form.email)){setError("A staff name and valid email are required.");return;}
  if(editId&&!initial){setError("Staff member not found.");return;}
  const row={...form,id:editId||String(staff.length+1)};
  setStaff(p=>editId?p.map(x=>x.id===editId?row:x):[...p,row]);router.push("/dashboard/staff");
 }
 return <main className="mx-auto max-w-3xl space-y-5"><header className="flex items-center gap-3">
  <Link href="/dashboard/staff" aria-label="Back to staff" className="rounded-full p-2"><ArrowLeft size={21}/></Link><div><h1 className="text-xl font-semibold">{editId?"Edit staff":"Add staff"}</h1><p className="text-xs text-gray-500">Manage team directory and role placeholders</p></div></header>
  <section className="space-y-5 rounded-2xl bg-white p-5 shadow-sm sm:p-7">
   <div className="flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-full bg-blue-50 text-[#0064E0]"><UserRoundCog size={23}/></span><div><h2 className="font-semibold">Staff information</h2><p className="text-xs text-gray-500">Invitations and access permissions are not active</p></div></div>
   <div className="grid gap-4 sm:grid-cols-2">{(["name","email","phone"] as const).map(key=><label key={key} className="flex flex-col gap-1.5 text-xs capitalize">{key}<input value={form[key]} type={key==="email"?"email":"text"} onChange={e=>setForm(p=>({...p,[key]:e.target.value}))} className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm"/></label>)}
    <label className="flex flex-col gap-1.5 text-xs">Role<select value={form.role} onChange={e=>setForm(p=>({...p,role:e.target.value}))} className="h-11 rounded-xl border bg-gray-50 px-3 text-sm"><option>Salesperson</option><option>Accountant</option><option>Manager</option><option>Viewer</option></select></label></div>
   {error?<p role="alert" className="text-xs text-red-600">{error}</p>:null}
   <p className="text-xs text-gray-500">This form manages only the temporary UI directory. It does not create staff accounts, invite users or grant permissions.</p>
   <div className="flex justify-end gap-2"><Link href="/dashboard/staff" className="rounded-full border px-5 py-3 text-sm">Cancel</Link>
    <button onClick={save} className="rounded-full bg-[#0064E0] px-6 py-3 text-sm font-semibold text-white">{editId?"Update staff":"Add staff"}</button></div>
  </section></main>;
}
