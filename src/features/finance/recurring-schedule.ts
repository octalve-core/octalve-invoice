/**
 * Deterministic DATE-ONLY recurrence preview.
 * No time-of-day conversion, currency posting, auto-issuance, or persistent rules.
 * Production scheduling requires tenant timezone, authorization and idempotent jobs.
 */
export type RecurringCadence = "weekly" | "monthly" | "quarterly" | "yearly";
export type RecurringScheduleInput = {
 start:string;
 end?:string;
 cadence:RecurringCadence;
 count:number;
};

const pad=(n:number)=>String(n).padStart(2,"0");
function monthEnd(year:number,monthIndex:number){
 return new Date(Date.UTC(year,monthIndex+1,0)).getUTCDate();
}
export function isValidRecurringDate(value:string):boolean{
 if(!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;
 const [year,month,day]=value.split("-").map(Number);
 return year>=2000&&year<=2100&&month>=1&&month<=12&&day>=1&&day<=monthEnd(year,month-1);
}
function shiftDate(start:string,cadence:RecurringCadence,index:number):string{
 const [year,month,day]=start.split("-").map(Number);
 if(cadence==="weekly"){
  const timestamp=Date.UTC(year,month-1,day)+index*7*86400000;
  return new Date(timestamp).toISOString().slice(0,10);
 }
 const interval=cadence==="monthly"?1:cadence==="quarterly"?3:12;
 const position=year*12+(month-1)+index*interval;
 const targetYear=Math.floor(position/12),targetMonth=position%12;
 const anchoredAtMonthEnd=day===monthEnd(year,month-1);
 const targetDay=anchoredAtMonthEnd?monthEnd(targetYear,targetMonth):Math.min(day,monthEnd(targetYear,targetMonth));
 return [targetYear,pad(targetMonth+1),pad(targetDay)].join("-");
}
/** At most twelve visible examples, respecting the end date and original day anchor. */
export function previewRecurringDates(input:RecurringScheduleInput):string[]{
 const {start,end,cadence,count}=input;
 if(!isValidRecurringDate(start))throw new Error("Choose a real start date.");
 if(end!==undefined&&end!==""&&(!isValidRecurringDate(end)||end<start))throw new Error("End date must be real and on or after start.");
 if(!["weekly","monthly","quarterly","yearly"].includes(cadence))throw new Error("Choose a supported schedule frequency.");
 if(!Number.isInteger(count)||count<1||count>12)throw new Error("Preview count must be between 1 and 12.");
 return Array.from({length:count},(_,i)=>shiftDate(start,cadence,i))
  .filter(value=>isValidRecurringDate(value)&&(!end||value<=end));
}
