"use client";

import { useState } from "react";
import StaffTable from "@/components/dashboard/tables/StaffTable";

export default function StaffPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Placeholder handlers
  const handleCreateStaff = (data: any) => {
    console.log("Creating staff:", data);
  };
  const handleEdit = (staff: any) => {
    console.log("Edit staff", staff);
  };
  const handleDelete = (staff: any) => {
    console.log("Delete staff", staff);
  };
  const handleDeactivate = (staff: any) => {
    console.log("Deactivate staff", staff);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Staff</h1>
        <p className="text-gray-500 mt-1">Add and manage your staff members</p>
      </div>

      {/* Staff Table */}
      <StaffTable
        onCreateClick={() => setIsCreateModalOpen(true)}
        onEditClick={handleEdit}
        onDeleteClick={handleDelete}
        onDeactivateClick={handleDeactivate}
      />

      {/* TODO: Staff creation modal */}
    </div>
  );
}
