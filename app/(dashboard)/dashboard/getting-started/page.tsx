import {MerchantSetupJourney} from "@/src/features/merchant-setup/MerchantSetupJourney";
export default async function GettingStartedPage({searchParams}:{searchParams:Promise<{step?:string}>}){
 const query=await searchParams;
 const step=(["business","appearance","payments","services"] as const).find(v=>v===query.step)??"business";
 return <MerchantSetupJourney initialStep={step}/>;
}
