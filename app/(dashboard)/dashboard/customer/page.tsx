"use client";

import { useState } from "react";
import CustomerTable from "@/components/dashboard/tables/CustomerTable";
import CustomerDetailsPanel from "@/components/dashboard/panels/CustomerDetailsPanel";
import MobileCustomerList from "@/components/dashboard/mobile/MobileCustomerList";
import MobileCustomerDetails from "@/components/dashboard/mobile/MobileCustomerDetails";
import DeleteCustomerModal from "@/components/dashboard/modals/DeleteCustomerModal";
import { useRouter } from "next/navigation";

interface SelectedCustomer {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  createdDate: string;
  amountDue: string;
}

export default function CustomerPage() {
  const router = useRouter();
  const [selectedCustomer, setSelectedCustomer] =
    useState<SelectedCustomer | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [mobileView, setMobileView] = useState<"list" | "details">("list");

  const handleCustomerClick = (customer: SelectedCustomer) => {
    setSelectedCustomer(customer);
    // On mobile, switch to details view
    setMobileView("details");
  };

  const handleCreateClick = () => {
    router.push("/dashboard/customer/add");
  };

  const handleEditClick = (customer?: SelectedCustomer) => {
    const customerToEdit = customer || selectedCustomer;
    if (customerToEdit) {
      // Navigate to edit page or open edit modal
      console.log("Editing customer:", customerToEdit.id);
      // router.push(`/dashboard/customer/edit/${customerToEdit.id}`);
    }
  };

  const handleDeleteClick = (customer?: SelectedCustomer) => {
    if (customer) {
      setSelectedCustomer(customer);
    }
    setIsDeleteModalOpen(true);
  };

  const handleDeleteCustomer = () => {
    console.log("Deleting customer:", selectedCustomer?.id);
    setIsDeleteModalOpen(false);
    setSelectedCustomer(null);
    setMobileView("list");
  };

  const handleClosePanel = () => {
    setSelectedCustomer(null);
  };

  const handleMobileBack = () => {
    setMobileView("list");
    setSelectedCustomer(null);
  };

  return (
    <>
      {/* Mobile View */}
      <div className="lg:hidden">
        {mobileView === "list" ? (
          <MobileCustomerList
            onCreateClick={handleCreateClick}
            onCustomerClick={handleCustomerClick}
          />
        ) : selectedCustomer ? (
          <MobileCustomerDetails
            customer={selectedCustomer}
            onBack={handleMobileBack}
            onEdit={() => handleEditClick()}
            onDelete={() => setIsDeleteModalOpen(true)}
          />
        ) : null}
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-2 gap-6 h-[calc(100vh-120px)]">
          {/* Customer List */}
          <CustomerTable
            onCreateClick={handleCreateClick}
            onCustomerClick={handleCustomerClick}
            onEditClick={handleEditClick}
            onDeleteClick={handleDeleteClick}
            selectedCustomerId={selectedCustomer?.id}
          />

          {/* Customer Details Panel */}
          <CustomerDetailsPanel
            customer={
              selectedCustomer
                ? {
                    id: selectedCustomer.id,
                    name: selectedCustomer.name,
                    email: selectedCustomer.email,
                    phone: selectedCustomer.phone,
                    createdDate: selectedCustomer.createdDate,
                  }
                : undefined
            }
            onClose={handleClosePanel}
            onEdit={() => handleEditClick()}
            onDelete={() => setIsDeleteModalOpen(true)}
          />
        </div>
      </div>

      {/* Delete Modal */}
      <DeleteCustomerModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteCustomer}
        customerName={selectedCustomer?.name}
      />
    </>
  );
}
