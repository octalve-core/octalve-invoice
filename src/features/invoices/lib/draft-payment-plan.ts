import type {CollectionMode,DynamicProvider,ProposedStage} from "./collection-expiry";
import type {PreviewCollectionSetup} from "../../merchant-preview/MerchantPreviewProvider";

/** The invoice draft owns terms. This is UI-only, not a provider payment or verified allocation. */
export interface DraftPaymentPlan{
 stageMode:"full"|"two"|"custom";
 firstPercent:number;
 twoDueDates:[string,string];
 customStages:{id:string;share:number;due:string}[];
 collectionMode:CollectionMode;
 dynamicProvider:DynamicProvider;
}
export const newDraftPaymentPlan=(setup?:PreviewCollectionSetup):DraftPaymentPlan=>({
 stageMode:"two",firstPercent:70,twoDueDates:["",""],
 customStages:[{id:"stage-1",share:50,due:""},{id:"stage-2",share:30,due:""},{id:"stage-3",share:20,due:""}],
 collectionMode:setup?.channel==="dynamic-account"?"dynamic-account":"company-bank",dynamicProvider:setup?.dynamicProvider??"monnify-invoice"
});
export function proposedStagesFromDraft(plan:DraftPaymentPlan,invoiceDueAtLagos:string):ProposedStage[]{
 return plan.stageMode==="full"?[{id:"full",share:100,dueAtLagos:invoiceDueAtLagos}]
 :plan.stageMode==="two"?[
  {id:"first",share:plan.firstPercent,dueAtLagos:plan.twoDueDates[0]},
  {id:"remaining",share:100-plan.firstPercent,dueAtLagos:plan.twoDueDates[1]}
 ]:plan.customStages.map(s=>({id:s.id,share:s.share,dueAtLagos:s.due}));
}
