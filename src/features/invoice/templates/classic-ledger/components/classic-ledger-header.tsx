"use client";

import type { BusinessIdentityProfile, InvoiceDraft } from "../../../types";
import { ClassicAutoTextarea } from "./classic-auto-textarea";
import styles from "../classic-ledger.module.css";

interface ClassicLedgerHeaderProps {
  draft: InvoiceDraft;
  businessProfile: BusinessIdentityProfile;
  companyLogo?: string | null;
  onBusinessProfileChange: <K extends keyof BusinessIdentityProfile>(key: K, value: BusinessIdentityProfile[K]) => void;
  onDraftChange: <K extends keyof InvoiceDraft>(key: K, value: InvoiceDraft[K]) => void;
  onDateChange: (key: "day" | "month" | "year", value: string) => void;
  onDueDateChange: (key: "dueDay" | "dueMonth" | "dueYear", value: string) => void;
  onInvoiceSequenceChange: (value: string | number) => void;
}

function DateFields({
  label,
  day,
  month,
  year,
  onChange,
}: {
  label: string;
  day: string;
  month: string;
  year: string;
  onChange: (key: "day" | "month" | "year", value: string) => void;
}) {
  return (
    <label className={styles.metaField}>
      <span>{label}</span>
      <span className={styles.dateFields}>
        <input aria-label={`${label} day`} value={day} maxLength={2} inputMode="numeric" onChange={(event) => onChange("day", event.target.value.replace(/\D/g, "").slice(0, 2))} />
        <span>/</span>
        <input aria-label={`${label} month`} value={month} maxLength={3} onChange={(event) => onChange("month", event.target.value.replace(/[^A-Za-z]/g, "").slice(0, 3).toUpperCase())} />
        <span>/</span>
        <input aria-label={`${label} year`} value={year} maxLength={4} inputMode="numeric" onChange={(event) => onChange("year", event.target.value.replace(/\D/g, "").slice(0, 4))} />
      </span>
    </label>
  );
}

export function ClassicLedgerHeader({
  draft,
  businessProfile,
  companyLogo,
  onBusinessProfileChange: _onBusinessProfileChange,
  onDraftChange,
  onDateChange,
  onDueDateChange,
  onInvoiceSequenceChange: _onInvoiceSequenceChange,
}: ClassicLedgerHeaderProps) {

  return (
    <>
      <header className={styles.brandHeader}>
        {companyLogo?<img className={styles.logo} src={companyLogo} alt={`${businessProfile.name} logo`} width={72} height={72}/>:null}
        <div className={styles.brandCopy}>
          <div className={styles.businessNameInput}>{businessProfile.name||"Your business name"}</div>
          <div className={styles.contactLine}>{[businessProfile.phone,businessProfile.email,businessProfile.website].filter(Boolean).join(" · ")}</div>
          <div className={styles.businessAddressInput}>{businessProfile.address}</div>
          <div className={styles.businessRegistration}>
           {businessProfile.tinNo?<span>TIN: {businessProfile.tinNo}</span>:null}
           {businessProfile.rcNo?<span>RC: {businessProfile.rcNo}</span>:null}
          </div>
        </div>
      </header>

      <div className={styles.documentTitle}>INVOICE</div>

      <section className={styles.metaPanel} aria-label="Invoice metadata">
        <div className={styles.invoiceNumberBlock}>
          <span className={styles.eyebrow}>Invoice No.</span>
          <span className={styles.sequenceEditor}>{draft.invoiceNo}</span>
        </div>

        <DateFields label="Date" day={draft.day} month={draft.month} year={draft.year} onChange={onDateChange} />
        <DateFields
          label="Due Date"
          day={draft.dueDay}
          month={draft.dueMonth}
          year={draft.dueYear}
          onChange={(key, value) => {
            const mapped = key === "day" ? "dueDay" : key === "month" ? "dueMonth" : "dueYear";
            onDueDateChange(mapped, value);
          }}
        />
      </section>

      <section className={styles.customerSection} aria-label="Customer details">
        <div className={styles.sectionKicker}>BILL TO</div>
        <label className={`${styles.lineField} ${styles.customerName}`}>
          <span>Name</span>
          <ClassicAutoTextarea value={draft.clientName} rows={1} aria-label="Classic Ledger customer name" onChange={(event) => onDraftChange("clientName", event.target.value)} placeholder="Customer or company name" />
        </label>
        <label className={styles.lineField}>
          <span>Address</span>
          <ClassicAutoTextarea value={draft.clientAddress} rows={1} aria-label="Classic Ledger customer address" onChange={(event) => onDraftChange("clientAddress", event.target.value)} placeholder="Customer address" />
        </label>
        <div className={styles.customerTwoColumns}>
          <label className={styles.lineField}>
            <span>Email</span>
            <input value={draft.clientEmail} onChange={(event) => onDraftChange("clientEmail", event.target.value)} placeholder="Email address" />
          </label>
          <label className={styles.lineField}>
            <span>Phone</span>
            <input value={draft.clientPhone} onChange={(event) => onDraftChange("clientPhone", event.target.value)} placeholder="Phone number" />
          </label>
        </div>
      </section>
    </>
  );
}
