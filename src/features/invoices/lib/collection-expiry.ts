import {allocateStages} from "./installments.ts";
import {dynamicAccountCapabilities} from "../../merchant-setup/payment-capabilities.ts";
export const INVOICE_TIMEZONE="Africa/Lagos" as const;
export type DynamicProvider=(typeof dynamicAccountCapabilities)[number]["id"];
export type CollectionMode="company-bank"|"dynamic-account";
export type ProposedStage={id:string;share:number;dueAtLagos:string};
export type ConfirmedAccountExpiry={
 stageId:string;provider:DynamicProvider;amountMinor:number;accountReference:string;
 expiresAtUtc:string;confirmedByServer:true;
};
export type PlanCheck={errors:string[];amountsMinor:number[];providerVerificationRequired:boolean;readyForIssue:boolean};
const LOCAL=/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/;
const UTC=/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/;
/** Strict Africa/Lagos local time conversion; Nigeria is UTC+01 without DST. */
export function lagosLocalToUtc(value:string):number|null{
 const match=LOCAL.exec(value);
 if(!match)return null;
 const [year,month,day,hour,minute]=match.slice(1).map(Number);
 if(year<2000||year>9999||month<1||month>12||day<1||day>31||hour>23||minute>59)return null;
 const local=Date.UTC(year,month-1,day,hour,minute);
 const check=new Date(local);
 if(check.getUTCFullYear()!==year||check.getUTCMonth()!==month-1||check.getUTCDate()!==day||check.getUTCHours()!==hour||check.getUTCMinutes()!==minute)return null;
 return local-3600000;
}
export function strictProviderUtc(value:string):number|null{
 if(!UTC.test(value))return null;
 const timestamp=Date.parse(value);
 if(!Number.isFinite(timestamp)||new Date(timestamp).toISOString().slice(0,19)!==value.slice(0,19))return null;
 return timestamp;
}
export function lagosDateTime(isoDate:string,hhmm:string){return /^\d{2}:\d{2}$/.test(hhmm)?isoDate+"T"+hhmm:"";}
export function providerPublishedReference(provider:DynamicProvider){
 const found=dynamicAccountCapabilities.find(p=>p.id===provider);
 return found?{label:found.duration,seconds:found.limitSeconds}:null;
}
/** Deterministic guard; verified expiry may ONLY come from a future authenticated server adapter. */
export function evaluateCollectionPlan(input:{
 totalMinor:number;invoiceDueAtLagos:string;stages:readonly ProposedStage[];
 mode:CollectionMode;provider?:DynamicProvider;
 verifiedExpiries?:readonly ConfirmedAccountExpiry[];
 asOfUtc?:string;
}):PlanCheck{
 const errors:string[]=[];
 const {stages,mode,invoiceDueAtLagos,totalMinor}=input;
 if(!Number.isSafeInteger(totalMinor)||totalMinor<=0)errors.push("Invoice amount must be a positive whole number of minor units.");
 if(stages.length<1||stages.length>6)errors.push("Choose one to six payment stages.");
 const ids=new Set<string>();
 for(const [i,s] of stages.entries()){
  if(!s.id||ids.has(s.id))errors.push("Each milestone needs a unique reference.");
  ids.add(s.id);
  if(!Number.isSafeInteger(s.share)||s.share<=0||s.share>100)errors.push("Milestone "+(i+1)+" needs a whole percentage above zero.");
 }
 const allocationOk=stages.length>0&&stages.length<=6&&stages.every(s=>Number.isSafeInteger(s.share)&&s.share>0&&s.share<=100)&&stages.reduce((sum,s)=>sum+s.share,0)===100;
 if(!allocationOk)errors.push("Milestone percentages must add up to exactly 100%.");
 const amountsMinor=allocationOk&&Number.isSafeInteger(totalMinor)&&totalMinor>0?allocateStages(totalMinor,stages.map(s=>s.share)):[];
 if(amountsMinor.some(amount=>amount<=0))errors.push("Every milestone must have a positive payable amount.");
 const invoiceDue=lagosLocalToUtc(invoiceDueAtLagos);
 if(invoiceDue===null)errors.push("Set a valid invoice due date and time (Africa/Lagos).");
 let previous:number|null=null;
 stages.forEach((stage,index)=>{
  const time=stage.dueAtLagos?lagosLocalToUtc(stage.dueAtLagos):null;
  if(stage.dueAtLagos&&time===null)errors.push("Milestone "+(index+1)+" has an invalid Lagos date or time.");
  if(mode==="dynamic-account"&&!stage.dueAtLagos)errors.push("Milestone "+(index+1)+" needs an exact due date and time for a dynamic account.");
  if(time!==null){
   if(invoiceDue!==null&&time>invoiceDue)errors.push("Milestone "+(index+1)+" exceeds the invoice due time.");
   if(previous!==null&&time<previous)errors.push("Milestone dates must be in chronological order.");
   previous=time;
  }
 });
 const providerVerificationRequired=mode==="dynamic-account";
 if(providerVerificationRequired){
  if(!input.provider||!dynamicAccountCapabilities.some(p=>p.id===input.provider))errors.push("Choose a supported dynamic-account provider.");
  if(!input.verifiedExpiries||input.verifiedExpiries.length!==stages.length){
   errors.push("A real provider-confirmed account and expiry is required for each milestone.");
  }else{
   const seen=new Set<string>();
   const references=new Set<string>();
   const asOf=input.asOfUtc?strictProviderUtc(input.asOfUtc):null;
   if(asOf===null)errors.push("Server issuance time is required to evaluate provider account expiry.");
   stages.forEach((stage,i)=>{
    const entry=input.verifiedExpiries!.find(e=>e.stageId===stage.id);
    if(!entry||seen.has(stage.id)||entry.confirmedByServer!==true||entry.provider!==input.provider||entry.amountMinor!==amountsMinor[i]){
     errors.push("Milestone "+(i+1)+" has no matching server-confirmed account expiry.");return;
    }
    seen.add(stage.id);
    if(!entry.accountReference||references.has(entry.accountReference))errors.push("Each milestone needs a distinct provider account reference.");
    references.add(entry.accountReference);
    const expiry=strictProviderUtc(entry.expiresAtUtc),due=lagosLocalToUtc(stage.dueAtLagos);
    if(expiry===null)errors.push("Milestone "+(i+1)+" has an invalid provider expiry timestamp.");
    else if(asOf!==null&&expiry<=asOf)errors.push("Milestone "+(i+1)+" provider account already expired.");
    else if(due!==null&&due>expiry)errors.push("Milestone "+(i+1)+" is due after its provider account expires.");
   });
  }
 }
 return {errors,amountsMinor,providerVerificationRequired,readyForIssue:false};
}
