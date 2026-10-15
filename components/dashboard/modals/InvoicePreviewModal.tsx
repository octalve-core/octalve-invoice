"use client";

import {
  X,
  Mail,
  MessageSquare,
  CreditCard,
  Printer,
  Download,
  MoreHorizontal,
  Share2,
} from "lucide-react";
import Image from "next/image";

interface InvoicePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice?: {
    reference: string;
    customer: string;
    amount: string;
    date: string;
    status: string;
  };
}

export default function InvoicePreviewModal({
  isOpen,
  onClose,
  invoice,
}: InvoicePreviewModalProps) {
  if (!isOpen || !invoice) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Invoice {invoice.reference}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          {/* Invoice Preview */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6">
            {/* Invoice Header */}
            <div className="flex items-start justify-between mb-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-[#41B63E] flex items-center justify-center">
                    <span className="text-white font-bold text-lg">F</span>
                  </div>
                  <span className="font-bold text-xl text-gray-900">
                    Finzefy
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  Invoice #{invoice.reference}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">
                  {invoice.amount}
                </p>
                <span
                  className={`inline-block mt-1 px-3 py-1 text-xs font-medium rounded-full ${
                    invoice.status === "paid"
                      ? "bg-green-100 text-green-700"
                      : invoice.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {invoice.status.charAt(0).toUpperCase() +
                    invoice.status.slice(1)}
                </span>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <p className="text-xs text-gray-500 mb-1">Bill To</p>
                <p className="font-medium text-gray-900">{invoice.customer}</p>
                <p className="text-sm text-gray-500">Lagos, Nigeria</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Invoice Date</p>
                <p className="font-medium text-gray-900">{invoice.date}</p>
              </div>
            </div>

            {/* Line Items */}
            <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">
                      Description
                    </th>
                    <th className="text-right text-xs font-medium text-gray-500 uppercase px-4 py-3">
                      Qty
                    </th>
                    <th className="text-right text-xs font-medium text-gray-500 uppercase px-4 py-3">
                      Rate
                    </th>
                    <th className="text-right text-xs font-medium text-gray-500 uppercase px-4 py-3">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-gray-100">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      Web Design Services
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 text-right">
                      1
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 text-right">
                      ₦15,000
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                      ₦15,000
                    </td>
                  </tr>
                  <tr className="border-t border-gray-100">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      Development
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 text-right">
                      1
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 text-right">
                      ₦5,000
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                      ₦5,000
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-48 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-gray-900">₦20,000</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tax (0%)</span>
                  <span className="text-gray-900">₦0</span>
                </div>
                <div className="flex justify-between text-base font-semibold pt-2 border-t border-gray-200">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">{invoice.amount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions Sidebar */}
          <div className="space-y-4">
            {/* QR Code */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Scan to Pay
              </p>
              <div className="w-32 h-32 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="w-24 h-24 bg-white rounded grid grid-cols-5 gap-0.5 p-2">
                  {/* Simple QR pattern */}
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div
                      key={i}
                      className={`aspect-square ${
                        Math.random() > 0.5 ? "bg-gray-900" : "bg-white"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
              <button className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-white bg-[#41B63E] rounded-lg hover:bg-[#36a137] transition-colors">
                <Mail className="w-4 h-4" />
                Send via Email
              </button>
              <button className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <MessageSquare className="w-4 h-4" />
                Send via SMS
              </button>
              <button className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <Share2 className="w-4 h-4" />
                Share Link
              </button>
            </div>

            {/* Secondary Actions */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
              <button className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                <CreditCard className="w-4 h-4" />
                Record Payment
              </button>
              <button className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                <Printer className="w-4 h-4" />
                Print Invoice
              </button>
              <button className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                <Download className="w-4 h-4" />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
