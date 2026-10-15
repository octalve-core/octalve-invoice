"use client";

import { useRouter } from "next/navigation";
import AddCustomerForm from "@/components/dashboard/forms/AddCustomerForm";

export default function AddCustomerPage() {
  const router = useRouter();

  const handleSubmit = (data: any) => {
    console.log("Creating customer:", data);
    // Here you would typically call an API to create the customer
    router.push("/dashboard/customer");
  };

  return (
    <AddCustomerForm
      onSubmit={handleSubmit}
      onCancel={() => router.push("/dashboard/customer")}
    />
  );
}
