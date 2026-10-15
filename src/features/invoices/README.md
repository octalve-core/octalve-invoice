# Invoice feature architecture
Pages compose sections, not domain decisions. The first migrated section is InvoiceMetricsSection; it contains visibly labeled fixtures only for UI Preview.
Next sections to extract: InvoiceHeader, InvoiceFilters, InvoiceTable, InvoiceCreateForm, CustomerSection, LineItemsSection, InvoiceTotals, PaymentDetailsSection, TemplateLivePreview and DocumentActions.
The Sapphire modern invoice render pipeline must receive the same normalized validated presentation model as the form; Classic Ledger is second invoice template. Never allow a client to declare paid status. Merchant authorization and financial state remain server-owned.
