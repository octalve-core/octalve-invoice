"use client";

import { useState } from "react";
import { X, Mail, MessageSquare, Share2, Check } from "lucide-react";

interface SendInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (options: {
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
  }) => void;
  invoiceRef?: string;
  customerEmail?: string;
}

export default function SendInvoiceModal({
  isOpen,
  onClose,
  onSend,
  invoiceRef,
  customerEmail = "customer@email.com",
}: SendInvoiceModalProps) {
  const [step, setStep] = useState<"options" | "success">("options");
  const [sendEmail, setSendEmail] = useState(true);
  const [sendSms, setSendSms] = useState(false);
  const [sendWhatsapp, setSendWhatsapp] = useState(false);

  const handleSend = () => {
    onSend({ email: sendEmail, sms: sendSms, whatsapp: sendWhatsapp });
    setStep("success");
  };

  const handleClose = () => {
    setStep("options");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        {step === "options" ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Send to Customer
              </h2>
              <button
                onClick={handleClose}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-sm text-gray-500 mb-4">
                Choose how to send invoice {invoiceRef} to customer
              </p>

              <div className="space-y-3 mb-6">
                <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:border-[#41B63E] transition-colors">
                  <input
                    type="checkbox"
                    checked={sendEmail}
                    onChange={(e) => setSendEmail(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-[#41B63E] focus:ring-[#41B63E]"
                  />
                  <Mail className="w-5 h-5 text-gray-500" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Send via Email</p>
                    <p className="text-sm text-gray-500">{customerEmail}</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:border-[#41B63E] transition-colors">
                  <input
                    type="checkbox"
                    checked={sendSms}
                    onChange={(e) => setSendSms(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-[#41B63E] focus:ring-[#41B63E]"
                  />
                  <MessageSquare className="w-5 h-5 text-gray-500" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Send via SMS</p>
                    <p className="text-sm text-gray-500">+234 xxx xxx xxxx</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:border-[#41B63E] transition-colors">
                  <input
                    type="checkbox"
                    checked={sendWhatsapp}
                    onChange={(e) => setSendWhatsapp(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-[#41B63E] focus:ring-[#41B63E]"
                  />
                  <Share2 className="w-5 h-5 text-gray-500" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      Send via WhatsApp
                    </p>
                    <p className="text-sm text-gray-500">Share invoice link</p>
                  </div>
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleClose}
                  className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSend}
                  disabled={!sendEmail && !sendSms && !sendWhatsapp}
                  className="flex-1 px-4 py-3 text-sm font-medium text-white bg-[#41B63E] rounded-lg hover:bg-[#36a137] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send Invoice
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Invoice Sent!
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Invoice {invoiceRef} has been sent to the customer.
            </p>
            <button
              onClick={handleClose}
              className="w-full px-4 py-3 text-sm font-medium text-white bg-[#41B63E] rounded-lg hover:bg-[#36a137]"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
