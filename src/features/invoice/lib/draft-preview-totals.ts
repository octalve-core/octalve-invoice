import type {InvoiceDraft,InvoiceTotals} from "../types";
import {calculateInvoiceTotals} from "./calculations";
import {calculateClassifiedPreview,calculateUntaxedPreview} from "../../tax/tax-domain";

/** Read-only frontend numbers. Unknown legal tax treatment never becomes a guessed tax rate. */
export function calculateDraftPreviewTotals(draft:InvoiceDraft):InvoiceTotals & {taxAssessed:boolean;taxNotice:string}{
 const legacy=calculateInvoiceTotals(draft.rows,draft.discount,"0");
 const preTax=calculateUntaxedPreview(draft.rows,draft.discount);
 const beforeTax={...legacy,total:preTax.netMinor===null?Number.NaN:preTax.netMinor/100};
 const proposal=calculateClassifiedPreview(draft.rows,draft.discount);
 if(!proposal.ready||proposal.totalMinor===null||proposal.taxMinor===null){
  return {...beforeTax,taxAssessed:false,taxNotice:proposal.reason};
 }
 return {...beforeTax,total:proposal.totalMinor/100,taxAmount:proposal.taxMinor/100,taxAssessed:true,
  taxNotice:"Illustrative tax proposal only. Official classification and issuance remain unavailable."};
}
