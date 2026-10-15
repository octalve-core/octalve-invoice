"use client";

import type { InvoicePresentation } from "../../../presentation/invoice-presentation";

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  try {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
  } finally {
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  }
}

export async function exportClassicLedgerPdf(
  presentation: InvoicePresentation,
  filename: string,
  accentColor?: string,
  merchantLogo?: string | null,
): Promise<void> {
  const [{ pdf }, { ClassicLedgerPdfDocument }] = await Promise.all([
    import("@react-pdf/renderer"),
    import("./classic-ledger-pdf-document"),
  ]);

  const logoSrc = merchantLogo ?? null;
  const headerImageSrc = null; // Uploaded merchant headers can be enabled when configured; never use donor header.
  const instance = pdf(
    <ClassicLedgerPdfDocument
      presentation={presentation}
      logoSrc={logoSrc}
      headerImageSrc={headerImageSrc}
      accentColor={accentColor}
    />,
  );
  const blob = await instance.toBlob();
  downloadBlob(blob, filename);
}
