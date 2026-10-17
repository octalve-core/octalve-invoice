/** The UI cannot grant itself financial issuance authority. */
export type InvoiceLifecycle="local_draft"|"saved_draft"|"pending_approval"|"pending_fiscalization"|"issued"|"partially_paid"|"paid"|"adjusted"|"voided";
export type IssuedDocumentEvidence={recorded:boolean;authorized:boolean;immutableSnapshot:boolean;fiscalizationRequired:boolean;fiscalizationVerified:boolean};
/** In Phase 1, this guard must ALSO run on the authenticated server after looking up the record. */
export function canDownloadIssuedInvoice(status:InvoiceLifecycle,evidence:IssuedDocumentEvidence):boolean{
 return ["issued","partially_paid","paid","adjusted"].includes(status)
  &&evidence.recorded&&evidence.authorized&&evidence.immutableSnapshot
  &&(!evidence.fiscalizationRequired||evidence.fiscalizationVerified);
}
/** No server-issued records exist in this frontend demo. */
export const PREVIEW_ISSUANCE_EVIDENCE:Readonly<IssuedDocumentEvidence>=Object.freeze({
 recorded:false,authorized:false,immutableSnapshot:false,fiscalizationRequired:false,fiscalizationVerified:false
});
