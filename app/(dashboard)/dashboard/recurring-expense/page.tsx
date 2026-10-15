"use client";

import { useRouter } from "next/navigation";
import RecurringExpenseTable from "@/components/dashboard/tables/RecurringExpenseTable";

export default function RecurringExpensePage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Recurring expense</h1>
        <p className="text-gray-500 mt-1">Automate expenses that repeat on a schedule</p>
      </div>

      <RecurringExpenseTable onCreateClick={() => router.push('/dashboard/recurring-expense/create')} />

      {/* TODO: create recurring expense modal */}
    </div>
  );
}
