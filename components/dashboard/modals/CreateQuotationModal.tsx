"use client";

import { useState } from "react";
import { X, Plus, Trash2, ChevronDown, ImageOff } from "lucide-react";
import {useMerchantPreview} from "@/src/features/merchant-preview/MerchantPreviewProvider";
import {formatDocumentNumber} from "@/src/features/invoices/lib/document-number";
import {newCatalogPreviewId,snapshotItem,isCatalogArchived} from "@/src/features/merchant-preview/catalog-contract";
import {calculateClassifiedPreview,type TaxClassification,unclassifiedTax} from "@/src/features/tax/tax-domain";
import {currencyCodes} from "@/src/features/invoice/types";
import {QuickCustomerEditor,emptyQuickCustomer,createQuickCustomer,quickCustomerInput,updateQuickCustomer,type QuickCustomerInput} from "@/src/features/catalog/QuickCustomerEditor";
import {QuickItemEditor,emptyQuickItem,createQuickItem} from "@/src/features/catalog/QuickItemEditor";
import type {CatalogItem} from "@/src/features/merchant-preview/MerchantPreviewProvider";

interface CreateQuotationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: QuotationData) => void;
}

interface LineItem {
  id: string;
  catalogItemId?:string;
  taxClassification?:TaxClassification;
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
  const {settings,customers,setCustomers,items,setItems,archivedRecords,invoicePreferences}=useMerchantPreview();
  const activeCustomers=customers.filter(c=>!isCatalogArchived("customer",c.id,archivedRecords));
  const activeItems=items.filter(i=>!isCatalogArchived("item",i.id,archivedRecords));
  const [addCustomerOpen,setAddCustomerOpen]=useState(false),[addItemOpen,setAddItemOpen]=useState(false);
  const [newItem,setNewItem]=useState<CatalogItem>(emptyQuickItem);
  const [newCustomer,setNewCustomer]=useState<QuickCustomerInput>(emptyQuickCustomer);
 const [editingCustomerId,setEditingCustomerId]=useState<string|null>(null),[editingItemId,setEditingItemId]=useState<string|null>(null);
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
  const taxPreview=calculateClassifiedPreview(formData.lineItems.map(x=>({
   id:x.id,quantity:String(x.quantity),unitPrice:String(x.rate),discount:String(x.discount),
   taxClassification:x.taxClassification||unclassifiedTax
  })),"0");
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
                      {activeCustomers.find(c=>c.id===formData.customer)?.name||"Select a customer"}
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
                    {activeCustomers.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
               <button type="button" onClick={()=>{setEditingCustomerId(null);setNewCustomer(emptyQuickCustomer());setAddCustomerOpen(true);}} className="flex items-center gap-1 rounded-full bg-blue-50 px-3 py-2 text-xs font-semibold text-[#0064E0]"><Plus size={15}/>Add new customer</button>
               {activeCustomers.some(c=>c.id===formData.customer)?<button type="button" onClick={()=>{
                const current=customers.find(c=>c.id===formData.customer);if(!current)return;
                setNewCustomer(quickCustomerInput(current));setEditingCustomerId(current.id);setAddCustomerOpen(true);
               }} className="rounded-full border border-blue-200 px-3 py-2 text-xs text-[#0064E0]">Edit selected customer</button>:null}
              </div>
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
                   <select aria-label="Choose quotation item" value={item.catalogItemId||""}
                     onChange={e=>{const chosen=activeItems.find(x=>x.id===e.target.value);if(!chosen)return;updateLineItem(item.id,"description",chosen.name);
                      setFormData(old=>({...old,lineItems:old.lineItems.map(x=>x.id===item.id?{...x,catalogItemId:snapshotItem(chosen).catalogItemId,description:chosen.name,taxClassification:chosen.taxClassification?{...chosen.taxClassification}:unclassifiedTax,rate:Number(chosen.rate),discount:Number(chosen.discountPercent),amount:Number(chosen.rate)*x.quantity*(1-Number(chosen.discountPercent)/100)}:x)}));}}
                     className="h-9 w-full rounded-lg border border-gray-200 bg-white px-2 text-xs">
                     <option value="">Select catalogue item</option>{activeItems.map(x=><option key={x.id} value={x.id}>{x.name}</option>)}
                   </select>
                    {item.catalogItemId&&activeItems.some(x=>x.id===item.catalogItemId)?<button type="button" className="mb-2 text-xs font-medium text-[#0064E0]" onClick={()=>{
                     const current=items.find(x=>x.id===item.catalogItemId);if(!current)return;
                     setNewItem({...current,taxClassification:current.taxClassification?{...current.taxClassification}:unclassifiedTax});setEditingItemId(current.id);setAddItemOpen(true);
                    }}>Edit catalogue item</button>:null}
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

              <button type="button" onClick={()=>{setEditingItemId(null);setNewItem(emptyQuickItem());setAddItemOpen(true);}} className="mb-3 flex items-center gap-2 rounded-full border border-[#0064E0] px-4 py-2 text-xs font-semibold text-[#0064E0]"><Plus size={15}/> Add new catalogue item</button>
              <button
                onClick={addLineItem}
                className="flex items-center gap-2 text-sm text-[#0064E0] hover:underline"
              >
                <Plus className="w-4 h-4" />
                Add another item
              </button>
            </div>
          </div>

          <p role="status" className="mt-4 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-900">Tax remains illustrative until all line classifications and merchant eligibility are reviewed. No official tax assessment or quotation has been issued.</p>
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
                    {taxPreview.ready?formatAmount((taxPreview.taxMinor??0)/100):"Requires Tax Centre review"}
                  </span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
                  <span className="font-medium text-gray-900">Total before unassessed tax</span>
                  <span className="font-bold text-[#0064E0]">
                    {taxPreview.ready?formatAmount((taxPreview.totalMinor??0)/100):formatAmount(totalBeforeTax)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {addItemOpen?<div role="presentation" className="fixed inset-0 z-[120] flex items-end justify-center bg-black/50 sm:items-center sm:p-4" onClick={()=>setAddItemOpen(false)}>
         <section role="dialog" aria-modal="true" aria-label="Add quotation catalogue item" onClick={e=>e.stopPropagation()} className="max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-5 sm:rounded-2xl">
          <div className="mb-3 flex items-center justify-between"><h3 className="font-semibold">{editingItemId?"Edit saved item":"Add product or service"}</h3><button type="button" aria-label="Close quotation item form" onClick={()=>setAddItemOpen(false)}><X size={19}/></button></div>
          <QuickItemEditor value={newItem} onChange={setNewItem}/>
          <button type="button" disabled={!newItem.name.trim()} onClick={()=>{
            try{
             const fresh=createQuickItem(newItem);
             const existing=items.find(x=>x.id===editingItemId);
             if(editingItemId&&!existing)return;
             if(existing){
              const updated={...existing,...fresh,id:existing.id};
              setItems(prev=>prev.map(x=>x.id===existing.id?updated:x));
              // Merchant catalogue edits must not silently change existing quotation line snapshots.
             }else{
              setItems(prev=>[...prev,fresh]);
              setFormData(prev=>({...prev,lineItems:[...prev.lineItems,{
               id:newCatalogPreviewId(),catalogItemId:fresh.id,description:fresh.name,quantity:1,rate:Number(fresh.rate),
               discount:Number(fresh.discountPercent),amount:Number(fresh.rate)*(1-Number(fresh.discountPercent)/100),
               taxClassification:fresh.taxClassification
              }]}));
             }
             setNewItem(emptyQuickItem());setEditingItemId(null);setAddItemOpen(false);
            }catch{ /* Invalid inputs remain visible for correction. */ }
           }} className="mt-4 w-full rounded-full bg-[#0064E0] p-3 text-sm font-semibold text-white disabled:opacity-40">{editingItemId?"Update catalogue (quote unchanged)":"Add and select item"}</button>
         </section></div>:null}
        {addCustomerOpen?<div className="fixed inset-0 z-[110] flex items-end justify-center bg-black/50 sm:items-center sm:p-4" onClick={()=>setAddCustomerOpen(false)}>
         <section role="dialog" aria-modal="true" aria-label="Add quotation customer" onClick={e=>e.stopPropagation()} className="w-full max-w-md space-y-3 rounded-t-2xl bg-white p-5 sm:rounded-2xl">
          <div className="flex items-center justify-between"><h3 className="font-semibold">{editingCustomerId?"Edit customer catalogue":"New customer"}</h3><button onClick={()=>setAddCustomerOpen(false)} aria-label="Close customer form"><X size={19}/></button></div>
          <QuickCustomerEditor value={newCustomer} onChange={setNewCustomer}/>
          <button type="button" disabled={!newCustomer.name.trim()} onClick={()=>{
           const existing=customers.find(c=>c.id===editingCustomerId);
           if(editingCustomerId&&!existing)return;
           const next=existing?updateQuickCustomer(existing,newCustomer):createQuickCustomer(newCustomer);
           setCustomers(p=>existing?p.map(c=>c.id===next.id?next:c):[...p,next]);
           if(!existing)setFormData(p=>({...p,customer:next.id,address:next.address}));
           setAddCustomerOpen(false);setEditingCustomerId(null);setNewCustomer(emptyQuickCustomer());
          }} className="w-full rounded-full bg-[#0064E0] p-3 text-sm font-semibold text-white disabled:opacity-40">{editingCustomerId?"Update catalogue (quote address unchanged)":"Add and select"}</button>
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
