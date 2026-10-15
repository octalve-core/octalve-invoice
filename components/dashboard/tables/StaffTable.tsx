"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Ban,
} from "lucide-react";
import StatusBadge from "@/components/dashboard/ui/StatusBadge";

interface Staff {
  id: string;
  refNo: string;
  name: string;
  permission: string;
  role: string;
  email: string;
  dateAdded: string;
  status: "active" | "inactive";
}

const dummyStaff: Staff[] = [
  {
    id: "1",
    refNo: "RFP0001",
    name: "Idris Jamiu",
    permission: "Overview, Invoice, Receipt, ...",
    role: "Salesperson",
    email: "samadop_...@gmail.com",
    dateAdded: "31/01/2024 05.30 PM",
    status: "active",
  },
  {
    id: "2",
    refNo: "RFP0002",
    name: "Idris Jamiu",
    permission: "Overview, Invoice, Receipt, ...",
    role: "Accountant",
    email: "samadop_...@gmail.com",
    dateAdded: "31/01/2024 05.30 PM",
    status: "inactive",
  },
  // Add more as needed
];

interface StaffTableProps {
  onCreateClick?: () => void;
  onEditClick?: (staff: Staff) => void;
  onDeleteClick?: (staff: Staff) => void;
  onDeactivateClick?: (staff: Staff) => void;
}

export default function StaffTable({
  onCreateClick,
  onEditClick,
  onDeleteClick,
  onDeactivateClick,
}: StaffTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);

  const filteredStaff = dummyStaff.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.refNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">Staff</h3>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-40 h-9 pl-9 pr-3 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#41B63E]/20 focus:border-[#41B63E]"
            />
          </div>

          {/* Add Staff Button */}
          <button
            onClick={onCreateClick}
            className="flex items-center gap-2 h-9 px-4 text-sm font-medium text-white bg-[#41B63E] rounded-lg hover:bg-[#36a137] transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add staff</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ref no
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                Permission
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                Role
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                Email
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                Date added
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filteredStaff.map((staff) => (
              <tr
                key={staff.id}
                className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
              >
                <td className="px-5 py-4 text-sm font-medium text-gray-900">
                  {staff.refNo}
                </td>
                <td className="px-5 py-4 text-sm text-gray-700">{staff.name}</td>
                <td className="px-5 py-4 hidden lg:table-cell text-sm text-gray-600">
                  {staff.permission}
                </td>
                <td className="px-5 py-4 hidden md:table-cell text-sm text-gray-600">
                  {staff.role}
                </td>
                <td className="px-5 py-4 hidden lg:table-cell text-sm text-gray-600">
                  {staff.email}
                </td>
                <td className="px-5 py-4 hidden md:table-cell text-sm text-gray-600">
                  {staff.dateAdded}
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={staff.status} />
                </td>
                <td className="px-5 py-4 relative">
                  <button
                    onClick={() =>
                      setOpenActionMenuId(
                        openActionMenuId === staff.id ? null : staff.id
                      )
                    }
                    className="p-1 rounded hover:bg-gray-100 transition-colors"
                  >
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>

                  {openActionMenuId === staff.id && (
                    <div className="absolute right-0 top-8 w-44 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                      <button
                        onClick={() => {
                          onEditClick?.(staff);
                          setOpenActionMenuId(null);
                        }}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          onDeleteClick?.(staff);
                          setOpenActionMenuId(null);
                        }}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                      <button
                        onClick={() => {
                          onDeactivateClick?.(staff);
                          setOpenActionMenuId(null);
                        }}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Ban className="w-4 h-4" />
                        Deactivate
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
