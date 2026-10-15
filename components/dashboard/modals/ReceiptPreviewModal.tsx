"use client";

import {
  X,
  Send,
  Printer,
  Download,
  Share2,
  Edit,
  Copy,
  Trash2,
} from "lucide-react";

interface ReceiptPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  receipt?: {
    reference: string;
    customerTo: string;
    amount: string;
    date: string;
    status: string;
  };
}

export default function ReceiptPreviewModal({
  isOpen,
  onClose,
  receipt,
}: ReceiptPreviewModalProps) {
  if (!isOpen) return null;

  const receiptData = receipt || {
    reference: "FZ-0088619388",
    customerTo: "Weypoint Energy Ltd",
    amount: "₦500,230.00",
    date: "23/6/2024",
    status: "Pending",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Receipt Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Receipt Preview */}
        <div className="p-6">
          {/* Company Info */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="w-12 h-12 rounded-lg bg-[#41B63E] flex items-center justify-center mb-2">
                <span className="text-white font-bold">FZ</span>
              </div>
              <h3 className="font-semibold text-gray-900">
                Weypoint Energy Ltd
              </h3>
              <p className="text-sm text-gray-500">
                No, 3a Fatai Atere way, Matori
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 mb-1">Receipt</p>
              <p className="text-sm font-medium text-gray-900">
                {receiptData.reference}
              </p>
              <div className="mt-2">
                <span className="px-2 py-0.5 text-xs font-medium text-orange-600 bg-orange-100 rounded-full">
                  {receiptData.status}
                </span>
              </div>
            </div>
          </div>

          {/* Bill Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Date Issued</p>
                <p className="font-medium text-gray-900">{receiptData.date}</p>
              </div>
              <div>
                <p className="text-gray-500">Due date</p>
                <p className="font-medium text-gray-900">30/7/2024</p>
              </div>
              <div>
                <p className="text-gray-500">Bill To</p>
                <p className="font-medium text-gray-900">
                  {receiptData.customerTo}
                </p>
              </div>
            </div>
          </div>

          {/* Amount */}
          <div className="text-center mb-6">
            <p className="text-sm text-gray-500 mb-1">Total Amount</p>
            <p className="text-3xl font-bold text-gray-900">
              {receiptData.amount}
            </p>
          </div>

          {/* Line Items */}
          <div className="border border-gray-200 rounded-lg mb-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-2 text-left font-medium text-gray-500">
                    Item Name
                  </th>
                  <th className="px-4 py-2 text-right font-medium text-gray-500">
                    Qty
                  </th>
                  <th className="px-4 py-2 text-right font-medium text-gray-500">
                    Unit Price
                  </th>
                  <th className="px-4 py-2 text-right font-medium text-gray-500">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">
                      Web Design Services
                    </p>
                    <p className="text-xs text-gray-500">
                      Creative design package
                    </p>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-600">1</td>
                  <td className="px-4 py-3 text-right text-gray-600">
                    ₦400,000
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-gray-900">
                    ₦400,000
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">Consultation</p>
                    <p className="text-xs text-gray-500">2 hours session</p>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-600">2</td>
                  <td className="px-4 py-3 text-right text-gray-600">
                    ₦25,000
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-gray-900">
                    ₦50,000
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="space-y-2 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="text-gray-900">₦450,000</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">VAT (7.5%)</span>
              <span className="text-gray-900">₦33,750</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Discount</span>
              <span className="text-gray-900">-₦0.00</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-200">
              <span className="font-medium text-gray-900">Total</span>
              <span className="font-bold text-gray-900">
                {receiptData.amount}
              </span>
            </div>
          </div>

          {/* QR Code */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-16 h-16 text-gray-400"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M3 3h6v6H3V3zm2 2v2h2V5H5zm8-2h6v6h-6V3zm2 2v2h2V5h-2zM3 13h6v6H3v-6zm2 2v2h2v-2H5zm13-2h1v1h-1v-1zm-5 0h3v1h-3v-1zm2 1v2h1v-2h-1zm2 2h1v1h-1v-1zm0 2v1h1v-1h-1zm-2 0h2v-1h-2v1zm0 1v1h1v-1h-1zm2 1h1v1h-1v-1z" />
              </svg>
            </div>
          </div>

          {/* Payment Info */}
          <div className="text-center text-sm text-gray-500 mb-6">
            <p>Scan to pay • Payment ID: {receiptData.reference}</p>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            <button className="flex flex-col items-center gap-1 p-3 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">
              <Edit className="w-5 h-5" />
              <span className="text-xs">Edit</span>
            </button>
            <button className="flex flex-col items-center gap-1 p-3 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">
              <Send className="w-5 h-5" />
              <span className="text-xs">Send</span>
            </button>
            <button className="flex flex-col items-center gap-1 p-3 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">
              <Copy className="w-5 h-5" />
              <span className="text-xs">Duplicate</span>
            </button>
            <button className="flex flex-col items-center gap-1 p-3 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">
              <Trash2 className="w-5 h-5" />
              <span className="text-xs">Delete</span>
            </button>
          </div>

          {/* Share/Download */}
          <div className="flex gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
              <Printer className="w-4 h-4" />
              Print
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[#41B63E] rounded-lg hover:bg-[#36a137]">
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
