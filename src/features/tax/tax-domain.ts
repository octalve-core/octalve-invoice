/**
 * Single typed tax *proposal* contract, shared by Tax Centre, catalogue and document previews.
 * This frontend has no authoritative law version, taxpayer eligibility or NRS integration.
 * Neither a percentage field nor a category name establishes a legal tax outcome.
 */
export const taxTreatments=["unclassified","standard","zero-rated","exempt","outside-scope","conditional"] as const;
export type TaxTreatment=(typeof taxTreatments)[number];
export type TaxReviewState="needs-review"|"owner-reviewed";
export interface TaxClassification {
 treatment:TaxTreatment;
 jurisdiction:string;
 effectiveFrom:string;
 ruleVersion:string;
 review:TaxReviewState;
 /** Percentage supplied under a separately reviewed rule; never inferred from item name. */
 proposedRatePercent?:string;
 reviewNote?:string;
}
export const unclassifiedTax:TaxClassification={
 treatment:"unclassified",jurisdiction:"NG",effectiveFrom:"",ruleVersion:"unverified",review:"needs-review"
};
export interface TaxCentrePolicy{
 jurisdiction:string;
 version:string;
 effectiveFrom:string;
 status:"research-pending"|"owner-reviewed";
 classifications:readonly TaxTreatment[];
}
export const defaultTaxCentrePolicy:TaxCentrePolicy={
 jurisdiction:"NG",version:"research-pending",effectiveFrom:"",
 status:"research-pending",classifications:taxTreatments
};
export function requiresTaxReview(item:TaxClassification|undefined):boolean{
 if(!item||item.review!=="owner-reviewed"||item.treatment==="unclassified"||item.treatment==="conditional"||!/^\d{4}-\d{2}-\d{2}$/.test(item.effectiveFrom)||!item.ruleVersion.trim()||item.ruleVersion==="unverified")return true;
 if(item.treatment==="standard"){
  const rate=item.proposedRatePercent;
  return !rate||!/^\d{1,3}(?:\.\d{1,2})?$/.test(rate)||Number(rate)>100;
 }
 return false;
}
/** Pure exact minor-unit proposal calculator. No tax computation if ANY line is legally unreviewed. */
export interface ClassifiedTaxLine{
 id:string;quantity:string;unitPrice:string;discount:string;taxClassification?:TaxClassification;
}
function minor(v:string):bigint|null{
 if(!/^\d+(?:\.\d{1,2})?$/.test(v))return null;
 const [a,b=""]=v.split(".");return BigInt(a)*BigInt(100)+BigInt(b.padEnd(2,"0"));
}
function quantityMilli(v:string):bigint|null{
 if(!/^\d+(?:\.\d{1,3})?$/.test(v))return null;
 const [a,b=""]=v.split(".");return BigInt(a)*BigInt(1000)+BigInt(b.padEnd(3,"0"));
}
function percentBasis(v:string):bigint|null{
 if(!/^\d{1,3}(?:\.\d{1,2})?$/.test(v)||Number(v)>100)return null;
 const [a,b=""]=v.split(".");return BigInt(a)*BigInt(100)+BigInt(b.padEnd(2,"0"));
}
const round=(numerator:bigint,denominator:bigint)=> (numerator+denominator/BigInt(2))/denominator;
const safe=(v:bigint)=>v>=BigInt(0)&&v<=BigInt(Number.MAX_SAFE_INTEGER)?Number(v):null;
/** Shared exact-money foundation for both classified and not-yet-classified drafts. */
function lineBaseMinor(line:ClassifiedTaxLine,overallDiscount:bigint):bigint|null{
 const price=minor(line.unitPrice),qty=quantityMilli(line.quantity),itemDiscount=percentBasis(line.discount);
 if(price===null||qty===null||itemDiscount===null)return null;
 const gross=round(price*qty,BigInt(1000));
 const afterItem=round(gross*(BigInt(10000)-itemDiscount),BigInt(10000));
 return round(afterItem*(BigInt(10000)-overallDiscount),BigInt(10000));
}
export function calculateUntaxedPreview(lines:readonly ClassifiedTaxLine[],overallDiscount:string){
 const discount=percentBasis(overallDiscount);
 if(discount===null||!lines.length)return {ready:false,reason:"Invalid discount or empty document",netMinor:null};
 let net=BigInt(0);
 for(const line of lines){
  const base=lineBaseMinor(line,discount);
  if(base===null)return {ready:false,reason:"Invalid item amount, quantity or discount",netMinor:null};
  net+=base;
 }
 const netMinor=safe(net);
 return netMinor===null?{ready:false,reason:"Amount exceeds safe money range",netMinor:null}:
  {ready:true,reason:"Pre-tax amount only; not a legal assessment",netMinor};
}
export function calculateClassifiedPreview(lines:readonly ClassifiedTaxLine[],overallDiscount:string){
 const preTax=calculateUntaxedPreview(lines,overallDiscount);
 if(!preTax.ready)return {ready:false,reason:preTax.reason,netMinor:null,taxMinor:null,totalMinor:null};
 const discount=percentBasis(overallDiscount)!;
 let tax=BigInt(0);
 for(const line of lines){
  if(requiresTaxReview(line.taxClassification))return {ready:false,reason:"Tax classification requires review",netMinor:preTax.netMinor,taxMinor:null,totalMinor:null};
  if(line.taxClassification?.treatment==="standard"){
   const base=lineBaseMinor(line,discount)!;
   const rate=percentBasis(line.taxClassification.proposedRatePercent||"");
   if(rate===null)return {ready:false,reason:"Invalid proposed tax rate",netMinor:preTax.netMinor,taxMinor:null,totalMinor:null};
   tax+=round(base*rate,BigInt(10000));
  }
 }
 const taxMinor=safe(tax),totalMinor=safe(BigInt(preTax.netMinor!)+tax);
 if(taxMinor===null||totalMinor===null)return {ready:false,reason:"Amounts exceed safe money range",netMinor:preTax.netMinor,taxMinor:null,totalMinor:null};
 return {ready:true,reason:"Illustrative only — not an official tax assessment",netMinor:preTax.netMinor,taxMinor,totalMinor};
}
