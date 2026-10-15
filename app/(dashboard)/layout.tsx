import {MerchantPreviewProvider} from "@/src/features/merchant-preview/MerchantPreviewProvider";
import Sidebar from "@/components/dashboard/Sidebar";
import TopNavbar from "@/components/dashboard/TopNavbar";
import MobileHeader from "@/components/dashboard/mobile/MobileHeader";
import BottomNavbar from "@/components/dashboard/mobile/BottomNavbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MerchantPreviewProvider><div className="flex min-h-screen min-w-0 max-w-full overflow-x-clip bg-[#F9FAFB]">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col min-h-screen">
        {/* Mobile Header */}
        <MobileHeader />

        {/* Desktop Top Navbar */}
        <TopNavbar />

        {/* Page Content */}
        <main className="min-w-0 flex-1 overflow-x-clip p-3 pb-24 sm:p-4 lg:p-6 lg:pb-6">
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
        <BottomNavbar />
      </div>
    </div></MerchantPreviewProvider>
  );
}
