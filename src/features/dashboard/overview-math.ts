/** Display-only example comparison. Live metrics require authenticated tenant-ledger totals. */
export function overviewChange(current:number,previous:number){
 if(!Number.isFinite(current)||!Number.isFinite(previous)||current<0||previous<0) return null;
 if(previous===0)return current===0?0:null;
 return Math.round(((current-previous)/Math.abs(previous))*1000)/10;
}
