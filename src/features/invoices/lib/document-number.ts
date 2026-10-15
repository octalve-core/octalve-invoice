/** Display references are provisional until server allocation is implemented.
 * NEVER allocate an issued reference on the client. NumberSeries is merchant scoped.
 */
export const DOCUMENT_CODES = {invoice:"INV",receipt:"RP",quotation:"QUO",creditNote:"CR"} as const;
export type DocumentType = keyof typeof DOCUMENT_CODES;
export function merchantInitials(name:string):string {
 const words=name.normalize("NFKC").trim().split(/\s+/).filter(Boolean)
   .filter(w=>!["ltd","llc","inc","plc","company","co","enterprise","enterprises"].includes(w.toLowerCase()));
 const initials=words.map(w=>w[0]).join("").replace(/[^a-zA-Z]/g,"").toUpperCase();
 return (initials||"ORG").slice(0,5);
}
export function formatDocumentNumber(merchant:string,sequence:number,type:DocumentType):string {
 if(!Number.isSafeInteger(sequence)||sequence<1) throw new Error("Invalid positive sequence");
 return `${merchantInitials(merchant)}-${String(sequence).padStart(5,"0")}${DOCUMENT_CODES[type]}`;
}
export function parseDocumentNumber(reference:string) {
 const match=/^([A-Z]{1,5})-(\d{5,})(INV|RP|QUO|CR)$/.exec(reference);
 if(!match) return null;
 return {initials:match[1],sequence:Number(match[2]),code:match[3]};
}
