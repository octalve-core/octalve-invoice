"use client";

import {
  X,
  ArrowLeft,
  Check,
  XCircle,
  Share2,
  Download,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

interface QuotationPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  quotation?: {
    id?: string;
    reference: string;
    clientName: string;
    amount: string;
    dateCreated: string;
    dateDue: string;
    email: string;
    status: string;
  };
}

export default function QuotationPreviewModal({
  isOpen,
  onClose,
  quotation,
}: QuotationPreviewModalProps) {
  if (!isOpen) return null;

  const quotationData = quotation || {
    reference: "FZ-00301",
    clientName: "Abdulsamad Ojedokun",
    amount: "₦120,000.00",
    dateCreated: "02/5/2024",
    dateDue: "02/5/2024",
    email: "samuelayodade@gmail.com",
    status: "Pending",
  };

  const products = [
    {
      id: "1",
      name: "Dell Express 512SSD Laptop",
      description: "Unit Price ₦400,000 . Qty: 1(₦1000.00)",
      amount: "₦850,000",
    },
    {
      id: "2",
      name: "iPhone 15 Pro Max",
      description: "Qty: 1 . Unit Price ₦970,000",
      amount: "₦970,000",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5 text-gray-500" />
            </button>
            <h2 className="text-lg font-semibold text-gray-900">
              Quotation Details
            </h2>
          </div>
          <span className="px-3 py-1 text-xs font-medium text-[#41B63E] bg-green-100 rounded-full">
            Pending
          </span>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {/* Company Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">W</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Weyport Energy Ltd
                </h3>
                <p className="text-xs text-gray-500">
                  No, 3a Fatai Atere way, Matori, industrial Lagos, Nigeria
                </p>
                <p className="text-xs text-gray-500">+23409012345672</p>
              </div>
            </div>
          </div>

          {/* Quotation Reference */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm text-gray-500">
              {quotationData.reference}
            </span>
            <span className="px-2 py-0.5 text-xs font-medium text-green-600 bg-green-100 rounded">
              Sent
            </span>
          </div>

          {/* Sent To */}
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-1">
              Sent to Abdulsamad Ojedokun
            </p>
            <p className="text-3xl font-bold text-gray-900">
              {quotationData.amount}
            </p>
          </div>

          {/* Details Grid */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 text-xs mb-1">Amount</p>
                <p className="font-medium text-gray-900">₦127,000.00</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">Date created</p>
                <p className="font-medium text-gray-900">
                  {quotationData.dateCreated}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">Date due</p>
                <p className="font-medium text-gray-900">
                  {quotationData.dateDue}
                </p>
              </div>
            </div>
          </div>

          {/* Products & Services */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3 px-2 py-1 bg-gray-100 rounded">
              Products & service
            </h4>
            <div className="space-y-3">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-start justify-between p-3 bg-[#E8F5E8] rounded-lg"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                      <span className="text-xs">📦</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {product.description}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {product.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Breakdown */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3 px-2 py-1 bg-gray-100 rounded">
              Payment Breakdown
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium text-gray-900">₦850,250</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Discount</span>
                <span className="font-medium text-red-500">-₦6,500</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">VAT (7.5%)</span>
                <span className="font-medium text-gray-900">₦59,875</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="font-medium text-gray-900">Total</span>
                <span className="font-bold text-[#41B63E]">₦970,218.75</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-2 px-2 py-1 bg-gray-100 rounded">
              Notes
            </h4>
            <p className="text-sm text-gray-600">Thank you for Choosing Us!</p>
          </div>

          {/* Contact Info */}
          <div className="flex items-center gap-4 text-xs text-gray-500 mb-6">
            <div className="flex items-center gap-1">
              <Mail className="w-3 h-3" />
              <span>Glo@wnkjhfn.com</span>
            </div>
            <div className="flex items-center gap-1">
              <Phone className="w-3 h-3" />
              <span>+2349012345876</span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs text-gray-500 mb-6">
            <MapPin className="w-3 h-3" />
            <span>2 Adeyemi Street, Oshertw lg, Ibilufa Mlle Lagos.</span>
          </div>

          {/* QR Code Section */}
          <div className="text-center mb-6">
            <p className="text-xs text-gray-500 mb-3">
              Scan to view more about X Business
            </p>
            <div className="inline-block p-4 bg-white border border-gray-200 rounded-lg">
              <div className="w-24 h-24 bg-gray-100 rounded flex items-center justify-center">
                <svg className="w-20 h-20 text-gray-800" viewBox="0 0 100 100">
                  <rect
                    x="10"
                    y="10"
                    width="20"
                    height="20"
                    fill="currentColor"
                  />
                  <rect
                    x="35"
                    y="10"
                    width="5"
                    height="5"
                    fill="currentColor"
                  />
                  <rect
                    x="45"
                    y="10"
                    width="5"
                    height="5"
                    fill="currentColor"
                  />
                  <rect
                    x="70"
                    y="10"
                    width="20"
                    height="20"
                    fill="currentColor"
                  />
                  <rect
                    x="10"
                    y="35"
                    width="5"
                    height="5"
                    fill="currentColor"
                  />
                  <rect
                    x="25"
                    y="35"
                    width="5"
                    height="5"
                    fill="currentColor"
                  />
                  <rect
                    x="35"
                    y="35"
                    width="15"
                    height="5"
                    fill="currentColor"
                  />
                  <rect
                    x="55"
                    y="35"
                    width="5"
                    height="5"
                    fill="currentColor"
                  />
                  <rect
                    x="70"
                    y="35"
                    width="5"
                    height="5"
                    fill="currentColor"
                  />
                  <rect
                    x="85"
                    y="35"
                    width="5"
                    height="5"
                    fill="currentColor"
                  />
                  <rect
                    x="10"
                    y="45"
                    width="5"
                    height="10"
                    fill="currentColor"
                  />
                  <rect
                    x="20"
                    y="45"
                    width="10"
                    height="5"
                    fill="currentColor"
                  />
                  <rect
                    x="45"
                    y="45"
                    width="10"
                    height="10"
                    fill="currentColor"
                  />
                  <rect
                    x="60"
                    y="45"
                    width="5"
                    height="5"
                    fill="currentColor"
                  />
                  <rect
                    x="70"
                    y="45"
                    width="5"
                    height="10"
                    fill="currentColor"
                  />
                  <rect
                    x="10"
                    y="70"
                    width="20"
                    height="20"
                    fill="currentColor"
                  />
                  <rect
                    x="35"
                    y="70"
                    width="5"
                    height="5"
                    fill="currentColor"
                  />
                  <rect
                    x="45"
                    y="70"
                    width="5"
                    height="5"
                    fill="currentColor"
                  />
                  <rect
                    x="55"
                    y="70"
                    width="5"
                    height="5"
                    fill="currentColor"
                  />
                  <rect
                    x="70"
                    y="70"
                    width="20"
                    height="5"
                    fill="currentColor"
                  />
                  <rect
                    x="70"
                    y="80"
                    width="5"
                    height="10"
                    fill="currentColor"
                  />
                  <rect
                    x="85"
                    y="80"
                    width="5"
                    height="10"
                    fill="currentColor"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center justify-center gap-4 text-xs text-gray-500 mb-6">
            <span>@WeyportEnergy</span>
            <span>@WeyportEnergy</span>
            <span>@WeyportEner5</span>
            <span>www.WeyportEnergy.com</span>
          </div>

          {/* Signature */}
          <div className="text-center mb-6">
            <div className="inline-block">
              <p
                className="text-2xl font-script text-gray-800 mb-1"
                style={{ fontFamily: "cursive" }}
              >
                Charles Unachukwu
              </p>
              <p className="text-xs text-gray-500">Signatory</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-[#41B63E] rounded-lg hover:bg-[#36a137]">
              <Check className="w-4 h-4" />
              Approve Quotation
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100">
              <XCircle className="w-4 h-4" />
              Disapprove Quotation
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
              <Share2 className="w-4 h-4" />
              Share Quotation
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-[#41B63E] bg-green-50 rounded-lg hover:bg-green-100">
              <Download className="w-4 h-4" />
              Download Quotation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
