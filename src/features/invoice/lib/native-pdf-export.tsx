"use client";

import type { InvoicePresentation } from "../presentation/invoice-presentation";

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

export async function exportNativeInvoicePdf(
  presentation: InvoicePresentation,
  filename: string,
  merchantLogo?: string | null,
): Promise<void> {
  const [{ pdf }, { SapphirePdfDocument }] = await Promise.all([
    import("@react-pdf/renderer"),
    import("../renderers/pdf/sapphire-pdf-document"),
  ]);

  const logoSrc = merchantLogo ?? null;
  const instance = pdf(
    <SapphirePdfDocument
      presentation={presentation}
      logoSrc={logoSrc}
    />,
  );
  const blob = await instance.toBlob();
  downloadBlob(blob, filename);
}
