import Link from "next/link";
import {ArrowLeft,ExternalLink,ShieldCheck} from "lucide-react";
export default function PaymentSetupHelpPage(){
 const docs=[
  {name:"Paystack",url:"https://paystack.com/docs/api/authentication/",note:"API Keys & Webhooks: public and server secret keys."},
  {name:"Flutterwave",url:"https://developer.flutterwave.com/docs/authentication",note:"API Keys: public/secret; encryption key only for relevant direct-charge flows."},
  {name:"Monnify",url:"https://developers.monnify.com/docs/collections/one-time-payments/invoice",note:"Developer API key, secret and contract code; unique dynamic invoice account."},
  {name:"PayPal",url:"https://developer.paypal.com/api/rest/authentication",note:"REST app Client ID and Client Secret, exchanged for an OAuth token."}
 ] as const;
 return <main className="mx-auto w-full max-w-[720px] space-y-4 pb-8">
  <Link href="/dashboard/getting-started/payments" className="inline-flex items-center gap-2 text-xs font-semibold text-[#0064E0]"><ArrowLeft size={15}/> Payment methods</Link>
  <header><h1 className="text-xl font-bold text-[#173652]">Payment setup guide</h1><p className="mt-1 text-sm text-slate-500">Find your provider credentials and learn how verification will work.</p></header>
  <div className="space-y-3">{docs.map(d=><article key={d.name} className="rounded-xl border border-[#E0E9F4] bg-white p-4">
   <h2 className="text-sm font-bold text-[#173652]">{d.name}</h2><p className="mt-1 text-xs text-slate-500">{d.note}</p>
   <a href={d.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[#0064E0]">Official setup documentation <ExternalLink size={13}/></a>
  </article>)}</div>
  <section className="space-y-2 rounded-xl border border-[#D8E6F5] bg-[#F5F9FF] p-4">
   <h2 className="flex items-center gap-2 text-sm font-bold text-[#173652]"><ShieldCheck size={18}/> How Octalve will connect safely</h2>
   <p className="text-xs leading-5 text-[#385573]">After secure merchant sign-in and server integration are authorised, Octalve will generate a verified callback URL, validate credentials from its server, encrypt secrets and confirm permissions. You will never need to share your banking password or OTP.</p>
   <p className="text-xs leading-5 text-[#385573]">Until then, these are sample setup screens only. Entering a bank number or selecting a provider does not connect it.</p>
  </section>
 </main>;
}
