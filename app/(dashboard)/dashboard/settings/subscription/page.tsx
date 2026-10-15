"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Loader2,
  Check,
  User,
  X,
} from "lucide-react";

type PlanFrequency = "monthly" | "quarterly" | "yearly";
type PlanStatus = "active" | "expired" | "none";
type PaymentMethod = "paystack" | "flutterwave";

interface Plan {
  name: string;
  price: number;
  frequency: PlanFrequency;
  duration: string;
  benefits: string[];
}

interface SubscriptionHistory {
  id: string;
  planName: string;
  duration: string;
  amount: number;
  status: "completed" | "pending" | "cancelled";
  activatedDate: string;
  expiredDate: string;
}

const plans: Record<PlanFrequency, Plan> = {
  monthly: {
    name: "Starter Plan",
    price: 1050,
    frequency: "monthly",
    duration: "30 days",
    benefits: [
      "Dolor fermentum imperdiet fermentum nibh ut",
      "Dolor fermentum imperdiet fermentum nibh ut",
      "Dolor fermentum imperdiet fermentum nibh ut",
      "Dolor fermentum imperdiet fermentum nibh ut",
      "Dolor fermentum imperdiet fermentum nibh ut",
    ],
  },
  quarterly: {
    name: "Starter Plan",
    price: 5250,
    frequency: "quarterly",
    duration: "90 days",
    benefits: [
      "Dolor fermentum imperdiet fermentum nibh ut",
      "Dolor fermentum imperdiet fermentum nibh ut",
      "Dolor fermentum imperdiet fermentum nibh ut",
      "Dolor fermentum imperdiet fermentum nibh ut",
      "Dolor fermentum imperdiet fermentum nibh ut",
    ],
  },
  yearly: {
    name: "Starter Plan",
    price: 10500,
    frequency: "yearly",
    duration: "365 days",
    benefits: [
      "Dolor fermentum imperdiet fermentum nibh ut",
      "Dolor fermentum imperdiet fermentum nibh ut",
      "Dolor fermentum imperdiet fermentum nibh ut",
      "Dolor fermentum imperdiet fermentum nibh ut",
      "Dolor fermentum imperdiet fermentum nibh ut",
    ],
  },
};

const subscriptionHistory: SubscriptionHistory[] = [
  {
    id: "1",
    planName: "Starter Plan",
    duration: "30 days",
    amount: 1050,
    status: "completed",
    activatedDate: "16/3/2024",
    expiredDate: "15/4/2024",
  },
  {
    id: "2",
    planName: "Starter Plan",
    duration: "30 days",
    amount: 1050,
    status: "completed",
    activatedDate: "16/3/2024",
    expiredDate: "15/4/2024",
  },
  {
    id: "3",
    planName: "Starter Plan",
    duration: "30 days",
    amount: 1050,
    status: "completed",
    activatedDate: "16/3/2024",
    expiredDate: "15/4/2024",
  },
];

// Change this to test different states: "active", "expired", "none"
const DEMO_PLAN_STATUS: PlanStatus = "active";

export default function SubscriptionPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFrequency, setSelectedFrequency] =
    useState<PlanFrequency>("monthly");
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod>("paystack");
  const [showPlanDetails, setShowPlanDetails] = useState(false);
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [showChangePlanModal, setShowChangePlanModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [planStatus] = useState<PlanStatus>(DEMO_PLAN_STATUS);

  const currentPlan = plans[selectedFrequency];

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}.00`;
  };

  const getFrequencyLabel = (freq: PlanFrequency) => {
    switch (freq) {
      case "monthly":
        return "Per Month";
      case "quarterly":
        return "Per Quarter";
      case "yearly":
        return "Per Year";
    }
  };

  const handleSubscribe = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    setShowPaymentModal(false);
    setShowSuccessModal(true);
  };

  const handleRenew = () => {
    setShowRenewModal(false);
    setShowPaymentModal(true);
  };

  // First Time User View
  const FirstTimeView = () => (
    <div className="space-y-6">
      <p className="text-sm text-gray-500">
        Kindly select your preferred plan payment frequency
      </p>

      {/* Frequency Tabs */}
      <div className="flex gap-2">
        {(["monthly", "quarterly", "yearly"] as PlanFrequency[]).map((freq) => (
          <button
            key={freq}
            onClick={() => setSelectedFrequency(freq)}
            className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
              selectedFrequency === freq
                ? "bg-[#1a2332] text-white border-[#1a2332]"
                : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
            }`}
          >
            {freq.charAt(0).toUpperCase() + freq.slice(1)}
          </button>
        ))}
      </div>

      {/* Plan Card */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          {currentPlan.name} - {formatPrice(currentPlan.price)}{" "}
          {getFrequencyLabel(currentPlan.frequency)}
        </h3>
        <p className="text-sm text-gray-500 mt-1">For {currentPlan.duration}</p>
      </div>

      {/* Plan Benefits */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">
          Plan Benefits
        </h4>
        <div className="space-y-2">
          {currentPlan.benefits.map((benefit, index) => (
            <div key={index} className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-[#41B63E]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-[#41B63E]" />
              </div>
              <span className="text-sm text-gray-600">{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Subscribe Button */}
      <button
        onClick={() => setShowPaymentModal(true)}
        className="w-full bg-[#41B63E] hover:bg-[#36a137] text-white font-semibold py-3 rounded-lg transition-colors"
      >
        Subscribe to Plan
      </button>
    </div>
  );

  // Active/Expired Plan View
  const ActivePlanView = () => (
    <div className="space-y-6">
      {/* Current Plan Card */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full ${
              planStatus === "active"
                ? "bg-[#41B63E]/10 text-[#41B63E]"
                : "bg-red-100 text-red-600"
            }`}
          >
            {planStatus === "active" ? "Current Plan" : "Plan Expired"}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          Starter Plan - ₦1,050.00
        </h3>
        <p className="text-sm text-gray-500 mt-1">For 30 days</p>
        <p className="text-xs text-gray-400 mt-2">
          Current: 24/5/2024 - 23/6/2024
        </p>

        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setShowPlanDetails(!showPlanDetails)}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-1"
          >
            {showPlanDetails ? "Collapse Plan Details" : "View Plan Details"}
            {showPlanDetails ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          {planStatus === "expired" && (
            <button
              onClick={() => setShowRenewModal(true)}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-[#41B63E] rounded-lg hover:bg-[#36a137] transition-colors"
            >
              Renew Plan
            </button>
          )}
        </div>
      </div>

      {/* Plan Benefits (when expanded) */}
      {showPlanDetails && (
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            Plan Benefits
          </h4>
          <div className="space-y-2">
            {plans.monthly.benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-[#41B63E]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-[#41B63E]" />
                </div>
                <span className="text-sm text-gray-600">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subscription History */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">
          Subscription History
        </h4>
        <div className="space-y-3">
          {subscriptionHistory.map((sub) => (
            <div
              key={sub.id}
              className="bg-white rounded-xl p-4 border border-gray-200 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{sub.planName}</p>
                  <p className="text-xs text-gray-500">{sub.duration}</p>
                  <p className="text-xs text-gray-400">
                    Activated: {sub.activatedDate} · Expired: {sub.expiredDate}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">
                  {formatPrice(sub.amount)}
                </p>
                <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                  Completed
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Payment Modal
  const PaymentModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 animate-fade-in-up">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Payment Method
          </h2>
          <button
            onClick={() => setShowPaymentModal(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Kindly select your preferred payment method
        </p>

        {/* Payment Options */}
        <div className="space-y-3 mb-6">
          <label
            className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-colors ${
              selectedPaymentMethod === "paystack"
                ? "border-[#41B63E] bg-green-50/30"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-bold text-xs">PS</span>
              </div>
              <span className="font-medium text-gray-900">
                Paystack Checkout
              </span>
            </div>
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedPaymentMethod === "paystack"
                  ? "border-[#41B63E] bg-[#41B63E]"
                  : "border-gray-300"
              }`}
              onClick={() => setSelectedPaymentMethod("paystack")}
            >
              {selectedPaymentMethod === "paystack" && (
                <Check className="w-3 h-3 text-white" />
              )}
            </div>
          </label>

          <label
            className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-colors ${
              selectedPaymentMethod === "flutterwave"
                ? "border-[#41B63E] bg-green-50/30"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                <span className="text-yellow-600 font-bold text-xs">FW</span>
              </div>
              <span className="font-medium text-gray-900">
                Flutterwave Checkout
              </span>
            </div>
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedPaymentMethod === "flutterwave"
                  ? "border-[#41B63E] bg-[#41B63E]"
                  : "border-gray-300"
              }`}
              onClick={() => setSelectedPaymentMethod("flutterwave")}
            >
              {selectedPaymentMethod === "flutterwave" && (
                <Check className="w-3 h-3 text-white" />
              )}
            </div>
          </label>
        </div>

        {/* Selected Plan Summary */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <p className="text-xs text-[#41B63E] font-medium mb-1">Paying for</p>
          <p className="font-semibold text-gray-900">
            {currentPlan.name} - {formatPrice(currentPlan.price)}
          </p>
          <p className="text-xs text-gray-500">
            {getFrequencyLabel(currentPlan.frequency)}
          </p>
        </div>

        {/* Proceed Button */}
        <button
          onClick={handleSubscribe}
          disabled={isLoading}
          className="w-full bg-[#41B63E] hover:bg-[#36a137] text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
            "Proceed"
          )}
        </button>
      </div>
    </div>
  );

  // Renew Modal
  const RenewModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 animate-fade-in-up">
        <h2 className="text-lg font-semibold text-gray-900 text-center mb-2">
          Renew Plan
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Are you sure you want to renew your subscription plan?
        </p>

        <button
          onClick={handleRenew}
          className="w-full bg-[#41B63E] hover:bg-[#36a137] text-white font-semibold py-3 rounded-lg transition-colors mb-3"
        >
          Upgrade Plan
        </button>

        <button
          onClick={() => setShowRenewModal(false)}
          className="w-full text-gray-600 font-medium py-3 rounded-lg hover:bg-gray-100 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );

  // Success Modal
  const SuccessModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 text-center animate-fade-in-up">
        <div className="w-16 h-16 rounded-full bg-[#41B63E] flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Subscription Successful
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          You have successfully subscribed to Starter Plan-₦1,050.00 monthly
        </p>

        <button
          onClick={() => {
            setShowSuccessModal(false);
            router.push("/dashboard");
          }}
          className="w-full bg-[#41B63E] hover:bg-[#36a137] text-white font-semibold py-3 rounded-lg transition-colors"
        >
          Go Home
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* ==================== MOBILE VIEW ==================== */}
      <div className="smallScreen min-h-screen pb-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">
            Manage Subscription
          </h1>
        </div>

        {planStatus === "none" ? <FirstTimeView /> : <ActivePlanView />}
      </div>

      {/* ==================== DESKTOP VIEW ==================== */}
      <div className="largeScreen">
        {/* Page Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Manage Subscription
            </h1>
            <p className="text-gray-500 mt-1">
              View and manage your subscription plan
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {planStatus === "none" ? (
              /* First Time - Plan Selection */
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <p className="text-sm text-gray-500 mb-4">
                  Kindly select your preferred plan payment frequency
                </p>

                {/* Frequency Tabs */}
                <div className="flex gap-3 mb-6">
                  {(["monthly", "quarterly", "yearly"] as PlanFrequency[]).map(
                    (freq) => (
                      <button
                        key={freq}
                        onClick={() => setSelectedFrequency(freq)}
                        className={`px-6 py-2.5 text-sm font-medium rounded-lg border transition-colors ${
                          selectedFrequency === freq
                            ? "bg-[#1a2332] text-white border-[#1a2332]"
                            : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        {freq.charAt(0).toUpperCase() + freq.slice(1)}
                      </button>
                    )
                  )}
                </div>

                {/* Plan Details */}
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {currentPlan.name} - {formatPrice(currentPlan.price)}{" "}
                    {getFrequencyLabel(currentPlan.frequency)}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    For {currentPlan.duration}
                  </p>
                </div>

                {/* Plan Benefits */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-4">
                    Plan Benefits
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {currentPlan.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-5 h-5 rounded-full bg-[#41B63E]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-[#41B63E]" />
                        </div>
                        <span className="text-sm text-gray-600">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Subscribe Button */}
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="mt-6 px-8 py-3 bg-[#41B63E] hover:bg-[#36a137] text-white font-semibold rounded-lg transition-colors"
                >
                  Subscribe to Plan
                </button>
              </div>
            ) : (
              /* Active/Expired Plan */
              <>
                {/* Current Plan Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        planStatus === "active"
                          ? "bg-[#41B63E]/10 text-[#41B63E]"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {planStatus === "active"
                        ? "Current Plan"
                        : "Plan Expired"}
                    </span>
                    {planStatus === "active" && (
                      <button
                        onClick={() => setShowChangePlanModal(true)}
                        className="text-sm text-[#41B63E] font-medium hover:underline"
                      >
                        Change Plan
                      </button>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Starter Plan - ₦1,050.00
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">For 30 days</p>
                  <p className="text-xs text-gray-400 mt-2">
                    Current: 24/5/2024 - 23/6/2024
                  </p>

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => setShowPlanDetails(!showPlanDetails)}
                      className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-1"
                    >
                      {showPlanDetails
                        ? "Collapse Plan Details"
                        : "View Plan Details"}
                      {showPlanDetails ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                    {planStatus === "expired" && (
                      <button
                        onClick={() => setShowRenewModal(true)}
                        className="px-6 py-2.5 text-sm font-medium text-white bg-[#41B63E] rounded-lg hover:bg-[#36a137] transition-colors"
                      >
                        Renew Plan
                      </button>
                    )}
                  </div>
                </div>

                {/* Plan Benefits (when expanded) */}
                {showPlanDetails && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-4">
                      Plan Benefits
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      {plans.monthly.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <div className="w-5 h-5 rounded-full bg-[#41B63E]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="w-3 h-3 text-[#41B63E]" />
                          </div>
                          <span className="text-sm text-gray-600">
                            {benefit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar - Subscription History */}
          {planStatus !== "none" && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-4">
                  Subscription History
                </h4>
                <div className="space-y-4">
                  {subscriptionHistory.map((sub) => (
                    <div
                      key={sub.id}
                      className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">
                            {sub.planName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {sub.duration}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 text-sm">
                          {formatPrice(sub.amount)}
                        </p>
                        <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                          Completed
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showPaymentModal && <PaymentModal />}
      {showRenewModal && <RenewModal />}
      {showSuccessModal && <SuccessModal />}

      {/* Change Plan Modal */}
      {showChangePlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 animate-fade-in-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Change Plan
              </h2>
              <button
                onClick={() => setShowChangePlanModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Most Popular Badge */}
            <div className="mb-4">
              <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                Most Popular
              </span>
            </div>

            {/* Professional Plan Card */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Professional Plan - ₦8,300.00
              </h3>
              <p className="text-sm text-gray-500 mt-1">For 30 days</p>
            </div>

            {/* Plan Benefits */}
            <div className="space-y-3 mb-6">
              {[
                "Dolor fermentum imperdiet fermentum nibh ut",
                "Dolor fermentum imperdiet fermentum nibh ut",
                "Dolor fermentum imperdiet fermentum nibh ut",
                "Dolor fermentum imperdiet fermentum nibh ut",
                "Dolor fermentum imperdiet fermentum nibh ut",
                "Dolor fermentum imperdiet fermentum nibh ut",
              ].map((benefit, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#41B63E]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-[#41B63E]" />
                  </div>
                  <span className="text-sm text-gray-600">{benefit}</span>
                </div>
              ))}
            </div>

            {/* Upgrade Button */}
            <button
              onClick={() => {
                setShowChangePlanModal(false);
                setShowPaymentModal(true);
              }}
              className="w-full bg-[#41B63E] hover:bg-[#36a137] text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Upgrade to Professional
            </button>
          </div>
        </div>
      )}
    </>
  );
}
