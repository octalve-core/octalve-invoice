"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ItemsTable from "@/components/dashboard/tables/ItemsTable";
import MobileItemsList from "@/components/dashboard/mobile/MobileItemsList";
import DeleteItemModal from "@/components/dashboard/modals/DeleteItemModal";

interface SelectedItem {
  id: string;
  productId: string;
  name: string;
  type: "goods" | "service";
  quantity: number;
  unitPrice: string;
  discount: string;
  tax: string;
  category: string;
}

export default function ItemsPage() {
  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleCreateClick = () => {
    router.push("/dashboard/items/add");
  };

  const handleViewClick = (item: SelectedItem) => {
    setSelectedItem(item);
    // For now, just log - could open a preview modal
    console.log("Viewing item:", item);
  };

  const handleEditClick = (item: SelectedItem) => {
    setSelectedItem(item);
    router.push(`/dashboard/items/add?edit=${item.id}`);
  };

  const handleDeleteClick = (item: SelectedItem) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteItem = () => {
    console.log("Deleting item:", selectedItem?.id);
    setIsDeleteModalOpen(false);
    setSelectedItem(null);
  };

  return (
    <>
      {/* Mobile View */}
      <MobileItemsList
        onCreateClick={handleCreateClick}
        onItemClick={handleViewClick}
        onViewClick={handleViewClick}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
      />

      {/* Desktop View */}
      <div className="hidden lg:block space-y-6">
        {/* Breadcrumb */}
        <div>
          <p className="text-sm text-gray-500">Product / Service</p>
        </div>

        {/* Items Table */}
        <ItemsTable
          onCreateClick={handleCreateClick}
          onViewClick={handleViewClick}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteClick}
        />
      </div>

      {/* Delete Modal */}
      <DeleteItemModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteItem}
        itemName={selectedItem?.name}
      />
    </>
  );
}
