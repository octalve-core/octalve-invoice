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
    <div className="flex min-h-screen bg-[#F9FAFB]">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <MobileHeader />

        {/* Desktop Top Navbar */}
        <TopNavbar />

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 pb-24 lg:pb-6 overflow-y-auto">
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
        <BottomNavbar />
      </div>
    </div>
  );
}
