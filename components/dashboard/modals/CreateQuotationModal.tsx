"use client";

import { useState } from "react";
import { X, Plus, Trash2, ChevronDown, ImageOff } from "lucide-react";
import {useMerchantPreview} from "@/src/features/merchant-preview/MerchantPreviewProvider";
import {formatDocumentNumber} from "@/src/features/invoices/lib/document-number";
import {newCatalogPreviewId,snapshotCustomer} from "@/src/features/merchant-preview/catalog-contract";
import {currencyCodes} from "@/src/features/invoice/types";

interface CreateQuotationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: QuotationData) => void;
}

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  discount: number;
  amount: number;
}

interface QuotationData {
  quotationNumber: string;
  customer: string;
  quotationPeriod: string;
  validUntil: string;
  currency: string;
  address: string;
  lineItems: LineItem[];
  note: string;
}

export default function CreateQuotationModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateQuotationModalProps) {
  const {settings,customers,setCustomers,items,invoicePreferences}=useMerchantPreview();
  const [addCustomerOpen,setAddCustomerOpen]=useState(false);
  const [newCustomer,setNewCustomer]=useState({name:"",email:""});
  const [formData, setFormData] = useState<QuotationData>({
    quotationNumber: formatDocumentNumber(settings.businessName||"Octalve Limited",1,"quotation"),
    customer: "",
    quotationPeriod: "",
    validUntil: "",
    currency: invoicePreferences.currency,
    address: "",
    lineItems: [
      {
        id: "1",
        description: "Dell Express 512SSD Laptop",
        quantity: 1,
        rate: 400000,
        discount: 0,
        amount: 400000,
      },
      {
        id: "2",
        description: "iPhone 15 Pro Max",
        quantity: 1,
        rate: 970000,
        discount: 0,
        amount: 970000,
      },
    ],
    note: "",
  });

  const addLineItem = () => {
    const newItem: LineItem = {
      id: newCatalogPreviewId(),
      description: "",
      quantity: 1,
      rate: 0,
      discount: 0,
      amount: 0,
    };
    setFormData({ ...formData, lineItems: [...formData.lineItems, newItem] });
  };

  const removeLineItem = (id: string) => {
    setFormData({
      ...formData,
      lineItems: formData.lineItems.filter((item) => item.id !== id),
    });
  };

  const updateLineItem = (
    id: string,
    field: keyof LineItem,
    value: string | number
  ) => {
    setFormData({
      ...formData,
      lineItems: formData.lineItems.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          updated.amount =
            updated.quantity * updated.rate * (1 - updated.discount / 100);
          return updated;
        }
        return item;
      }),
    });
  };

  const subtotal = formData.lineItems.reduce(
    (sum, item) => sum + item.amount,
    0
  );
  const discount = formData.lineItems.reduce(
    (sum, item) => sum + (item.quantity * item.rate * item.discount) / 100,
    0
  );
  // No legal tax classification has been verified: never insert a blanket VAT rate.
  const totalBeforeTax = subtotal;
  const formatAmount=(value:number)=>new Intl.NumberFormat("en-NG",{style:"currency",currency:formData.currency,minimumFractionDigits:2,maximumFractionDigits:2}).format(value);

  const handleSubmit = () => {
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center overflow-y-auto bg-black/50 p-0 sm:items-center sm:p-4">
      <div className="bg-white rounded-t-2xl shadow-xl w-full max-w-4xl my-0 sm:my-8 sm:rounded-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
            <h2 className="text-lg font-semibold text-gray-900">
              Create Quotation
            </h2>
          </div>
        </div>

        {/* Form */}
        <div className="max-h-[72dvh] overflow-y-auto p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Quotation for Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Quotation for Info
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Bill to
                    </label>
                    <p className="text-sm font-medium text-gray-900">
                      {customers.find(c=>c.id===formData.customer)?.name||"Select a customer"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Email
                    </label>
                    <p className="text-sm text-gray-600">{customers.find(c=>c.id===formData.customer)?.email||"No email selected"}</p>
                  </div>
                </div>
              </div>

              {/* Customer */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer
                </label>
                <div className="relative">
                  <select
                    value={formData.customer}
                    onChange={(e) =>
                      setFormData({ ...formData, customer: e.target.value })
                    }
                    className="w-full h-11 px-4 pr-10 text-sm bg-gray-50 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#0064E0]/20 focus:border-[#0064E0]"
                  >
                    <option value="">Select Customer</option>
                    {customers.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <button type="button" onClick={()=>setAddCustomerOpen(true)} className="flex items-center gap-1 rounded-full bg-blue-50 px-3 py-2 text-xs font-semibold text-[#0064E0]"><Plus size={15}/>Add new customer</button>
                            {/* Quotation Period */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quotation period
                </label>
                <div className="relative">
                  <select
                    value={formData.quotationPeriod}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quotationPeriod: e.target.value,
                      })
                    }
                    className="w-full h-11 px-4 pr-10 text-sm bg-gray-50 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#0064E0]/20 focus:border-[#0064E0]"
                  >
                    <option value="">Select Period</option>
                    <option value="7">7 days</option>
                    <option value="14">14 days</option>
                    <option value="30">30 days</option>
                    <option value="60">60 days</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Valid Until */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valid Until
                </label>
                <input
                  type="date"
                  value={formData.validUntil}
                  onChange={(e) =>
                    setFormData({ ...formData, validUntil: e.target.value })
                  }
                  className="w-full h-11 px-4 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0064E0]/20 focus:border-[#0064E0]"
                />
              </div>

              {/* Currency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Currency
                </label>
                <div className="relative">
                  <select
                    value={formData.currency}
                    onChange={(e) =>
                      setFormData({ ...formData, currency: e.target.value })
                    }
                    className="w-full h-11 px-4 pr-10 text-sm bg-gray-50 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#0064E0]/20 focus:border-[#0064E0]"
                  >
                    {currencyCodes.map(code=><option key={code} value={code}>{code}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Edit Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Edit Address
                </label>
                <input
                  type="text"
                  placeholder="Enter address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full h-11 px-4 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0064E0]/20 focus:border-[#0064E0]"
                />
              </div>
            </div>

            {/* Right Column - Items */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-700">Items</h3>
                <span className="rounded-full bg-blue-50 px-3 py-2 text-xs text-[#0064E0]">Saved items · no image uploads yet</span>
              </div>

              <p className="text-xs leading-5 text-gray-500">Choose products or services from your catalogue. You can adjust quantities and prices before a quotation is sent. A quotation is not a payment request or receipt.</p>
              {/* Items List */}
              <div className="space-y-3">
                {formData.lineItems.map((item) => (
                  <div key={item.id} className="space-y-3 rounded-lg bg-[#eff6ff] p-3">
                   <select aria-label="Choose quotation item" value={items.find(x=>x.name===item.description)?.id||""}
                     onChange={e=>{const chosen=items.find(x=>x.id===e.target.value);if(!chosen)return;updateLineItem(item.id,"description",chosen.name);
                      setFormData(old=>({...old,lineItems:old.lineItems.map(x=>x.id===item.id?{...x,description:chosen.name,rate:Number(chosen.rate),discount:Number(chosen.discountPercent),amount:Number(chosen.rate)*x.quantity*(1-Number(chosen.discountPercent)/100)}:x)}));}}
                     className="h-9 w-full rounded-lg border border-gray-200 bg-white px-2 text-xs">
                     <option value="">Select catalogue item</option>{items.map(x=><option key={x.id} value={x.id}>{x.name}</option>)}
                   </select>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-white rounded flex items-center justify-center"><ImageOff size={17} className="text-gray-400"/></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {item.description}
                          </p>
                          <p className="text-xs text-gray-500">
                            Unit Price {formatAmount(item.rate)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeLineItem(item.id)}
                        className="p-1 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <label className="flex items-center gap-2 text-xs text-gray-500">Qty
                       <input type="number" min="1" aria-label="Quotation item quantity" value={item.quantity} onChange={e=>updateLineItem(item.id,"quantity",Math.max(1,Number(e.target.value)))} className="w-16 rounded border bg-white px-2 py-1 text-xs"/>
                      </label>
                      <span className="text-sm font-semibold text-[#0064E0]">
                        {formatAmount(item.amount)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={addLineItem}
                className="flex items-center gap-2 text-sm text-[#0064E0] hover:underline"
              >
                <Plus className="w-4 h-4" />
                Add another item
              </button>
            </div>
          </div>

          {/* Totals */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-end">
              <div className="w-72 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium text-gray-900">
                    {formatAmount(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Discount</span>
                  <span className="font-medium text-gray-900">
                    -{formatAmount(discount)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tax classification</span>
                  <span className="font-medium text-gray-900">
                    Requires Tax Centre review
                  </span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
                  <span className="font-medium text-gray-900">Total before unassessed tax</span>
                  <span className="font-bold text-[#0064E0]">
                    {formatAmount(totalBeforeTax)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {addCustomerOpen?<div className="fixed inset-0 z-[110] flex items-end justify-center bg-black/50 sm:items-center sm:p-4" onClick={()=>setAddCustomerOpen(false)}>
         <section role="dialog" aria-modal="true" aria-label="Add quotation customer" onClick={e=>e.stopPropagation()} className="w-full max-w-md space-y-3 rounded-t-2xl bg-white p-5 sm:rounded-2xl">
          <div className="flex items-center justify-between"><h3 className="font-semibold">New customer</h3><button onClick={()=>setAddCustomerOpen(false)} aria-label="Close customer form"><X size={19}/></button></div>
          <label className="block text-xs">Customer name<input value={newCustomer.name} onChange={e=>setNewCustomer(p=>({...p,name:e.target.value}))} className="mt-1 h-10 w-full rounded-lg border px-3 text-sm"/></label>
          <label className="block text-xs">Email (optional)<input value={newCustomer.email} onChange={e=>setNewCustomer(p=>({...p,email:e.target.value}))} className="mt-1 h-10 w-full rounded-lg border px-3 text-sm"/></label>
          <button disabled={!newCustomer.name.trim()} onClick={()=>{const id=newCatalogPreviewId();setCustomers(p=>[...p,{id,name:newCustomer.name,email:newCustomer.email,phone:"",address:"",company:""}]);setFormData(p=>({...p,customer:id}));setAddCustomerOpen(false);setNewCustomer({name:"",email:""});}} className="w-full rounded-full bg-[#0064E0] p-3 text-sm font-semibold text-white disabled:opacity-40">Add and select</button>
         </section></div>:null}
                {/* Footer */}
        <div className="flex items-center justify-center gap-4 px-6 py-4 border-t border-gray-200">
          <button
            onClick={handleSubmit}
            className="px-8 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Save Draft
          </button>
          <button
            onClick={handleSubmit}
            className="px-8 py-2.5 text-sm font-medium text-white bg-[#0064E0] rounded-lg hover:bg-[#0052B8]"
          >
            Create Quotation
          </button>
        </div>
      </div>
    </div>
  );
}
