/** Exact integer-minor-unit installment math for Preview/approved backend reuse.
 * Financial authority is never granted by this pure calculation function.
 */
export function splitInstallment(amountMinor:number,percent:number):[number,number]{
 if(!Number.isSafeInteger(amountMinor)||amountMinor<=0||!Number.isInteger(percent)||percent<1||percent>99)throw new Error("Invalid installment plan");
 const first=Number(BigInt(amountMinor)*BigInt(percent)/BigInt(100));
 const remaining=amountMinor-first;
 if(!Number.isSafeInteger(first)||first<0||!Number.isSafeInteger(remaining)||remaining<0||first+remaining!==amountMinor)throw new Error("Installment allocation is invalid");
 return [first,remaining];
}
export function allocateStages(amountMinor:number,weights:number[]):number[]{
 if(!Number.isSafeInteger(amountMinor)||amountMinor<=0||!weights.length||weights.length>24||weights.some(x=>!Number.isInteger(x)||x<=0)||weights.reduce((a,b)=>a+b,0)!==100)throw new Error("Stage percentages must total exactly 100");
 let remaining=amountMinor;
 return weights.map((weight,index)=>{
  if(index===weights.length-1)return remaining;
  const allocated=Number(BigInt(amountMinor)*BigInt(weight)/BigInt(100));
  remaining-=allocated;
  return allocated;
 });
}
