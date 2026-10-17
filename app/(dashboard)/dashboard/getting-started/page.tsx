import {MerchantSetupJourney} from "@/src/features/merchant-setup/MerchantSetupJourney";
import {GettingStartedHome} from "@/src/features/getting-started/GettingStartedHome";
export default async function GettingStartedPage({searchParams}:{searchParams:Promise<{step?:string}>}){
 const query=await searchParams;
 if(!query.step)return <GettingStartedHome/>;
 const step=(["business","appearance","payments","services"] as const).find(v=>v===query.step)??"business";
 return <MerchantSetupJourney initialStep={step}/>;
}
