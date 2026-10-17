import {redirect} from "next/navigation";
import {GettingStartedHome} from "@/src/features/getting-started/GettingStartedHome";
export default async function GettingStartedPage({searchParams}:{searchParams:Promise<{step?:string}>}){
 const {step}=await searchParams;
 if(step==="business")redirect("/dashboard/getting-started/business");
 if(step==="appearance")redirect("/dashboard/settings/invoice?from=getting-started");
 if(step==="payments")redirect("/dashboard/getting-started/payments");
 if(step==="services")redirect("/dashboard/getting-started");
 return <GettingStartedHome/>;
}
