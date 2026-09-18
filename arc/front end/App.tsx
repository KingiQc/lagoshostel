import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import FindHostel from "./pages/FindHostel";
import HostelDetails from "./pages/HostelDetails";
import Login from "./pages/Login";
import OwnerDashboard from "./pages/OwnerDashboard";
import StudentPortal from "./pages/StudentPortal";
import OwnerPortal from "./pages/OwnerPortal";
import PublicPage from "./pages/PublicPage";
import BookingCheckout from "./pages/BookingCheckout";
import BookingDetails from "./pages/BookingDetails";
import AddProperty from "./pages/AddProperty";
import StudentOperations from "./pages/StudentOperations";
import StudentApplication from "./pages/StudentApplication";
import OwnerApplications from "./pages/OwnerApplications";
import UniversityPortal from "./pages/UniversityPortal";
import UniversityOverviewPage from "./pages/UniversityOverviewPage";
import UniversityAccommodationPage from "./pages/UniversityAccommodationPage";
import UniversityVerificationPage from "./pages/UniversityVerificationPage";
import UniversityRecommendationsPage from "./pages/UniversityRecommendationsPage";
import UniversityStudentsPage from "./pages/UniversityStudentsPage";
import UniversityReportsPage from "./pages/UniversityReportsPage";
import UniversitySettingsPage from "./pages/UniversitySettingsPage";
import AdminPortal from "./pages/AdminPortal";
import StudentOverviewPage from "./pages/StudentOverviewPage";
import StudentDiscoverPage from "./pages/StudentDiscoverPage";
import StudentSavedPage from "./pages/StudentSavedPage";
import StudentApplicationsPage from "./pages/StudentApplicationsPage";
import StudentBookingsPage from "./pages/StudentBookingsPage";
import StudentPaymentsPage from "./pages/StudentPaymentsPage";
import StudentMessagesPage from "./pages/StudentMessagesPage";
import StudentProfilePage from "./pages/StudentProfilePage";
import StudentMaintenancePage from "./pages/StudentMaintenancePage";
import StudentNotificationsPage from "./pages/StudentNotificationsPage";
import OwnerOverviewPage from "./pages/OwnerOverviewPage";
import OwnerPropertiesPage from "./pages/OwnerPropertiesPage";
import OwnerRoomsPage from "./pages/OwnerRoomsPage";
import OwnerApplicationsPage from "./pages/OwnerApplicationsPage";
import OwnerBookingsPage from "./pages/OwnerBookingsPage";
import OwnerPaymentsPage from "./pages/OwnerPaymentsPage";
import OwnerMessagesPage from "./pages/OwnerMessagesPage";
import OwnerReviewsPage from "./pages/OwnerReviewsPage";
import OwnerAnalyticsPage from "./pages/OwnerAnalyticsPage";
import OwnerSettingsPage from "./pages/OwnerSettingsPage";
import AdminOverviewPage from "./pages/AdminOverviewPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminPropertiesPage from "./pages/AdminPropertiesPage";
import AdminVerificationPage from "./pages/AdminVerificationPage";
import AdminBookingsPage from "./pages/AdminBookingsPage";
import AdminPaymentsPage from "./pages/AdminPaymentsPage";
import AdminDisputesPage from "./pages/AdminDisputesPage";
import AdminReportsPage from "./pages/AdminReportsPage";
import AdminSettingsPage from "./pages/AdminSettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/find-a-hostel" element={<FindHostel />} />
          <Route path="/universities" element={<PublicPage />} />
          <Route path="/university" element={<UniversityOverviewPage />} />
          <Route path="/university/accommodation" element={<UniversityAccommodationPage />} />
          <Route path="/university/verification" element={<UniversityVerificationPage />} />
          <Route path="/university/recommendations" element={<UniversityRecommendationsPage />} />
          <Route path="/university/students" element={<UniversityStudentsPage />} />
          <Route path="/university/reports" element={<UniversityReportsPage />} />
          <Route path="/university/settings" element={<UniversitySettingsPage />} />
          <Route path="/university/*" element={<UniversityPortal />} />
          <Route path="/admin" element={<AdminOverviewPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/properties" element={<AdminPropertiesPage />} />
          <Route path="/admin/verification" element={<AdminVerificationPage />} />
          <Route path="/admin/bookings" element={<AdminBookingsPage />} />
          <Route path="/admin/payments" element={<AdminPaymentsPage />} />
          <Route path="/admin/disputes" element={<AdminDisputesPage />} />
          <Route path="/admin/reports" element={<AdminReportsPage />} />
          <Route path="/admin/settings" element={<AdminSettingsPage />} />
          <Route path="/admin/*" element={<AdminPortal />} />
          <Route path="/how-it-works" element={<PublicPage />} />
          <Route path="/about" element={<PublicPage />} />
          <Route path="/safety" element={<PublicPage />} />
          <Route path="/help" element={<PublicPage />} />
          <Route path="/contact" element={<PublicPage />} />
          <Route path="/faq" element={<PublicPage />} />
          <Route path="/terms" element={<PublicPage />} />
          <Route path="/privacy" element={<PublicPage />} />
          <Route path="/hostels/:id" element={<HostelDetails />} />
          <Route path="/booking/checkout" element={<BookingCheckout />} />
          <Route path="/student/bookings/:id" element={<BookingDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Login />} />
          <Route path="/dashboard" element={<StudentOverviewPage />} />
          <Route path="/student" element={<StudentOverviewPage />} />
          <Route path="/student/search" element={<StudentDiscoverPage />} />
          <Route path="/student/saved" element={<StudentSavedPage />} />
          <Route path="/student/applications" element={<StudentApplicationsPage />} />
          <Route path="/student/bookings" element={<StudentBookingsPage />} />
          <Route path="/student/payments" element={<StudentPaymentsPage />} />
          <Route path="/student/messages" element={<StudentMessagesPage />} />
          <Route path="/student/profile" element={<StudentProfilePage />} />
          <Route path="/student/maintenance" element={<StudentMaintenancePage />} />
          <Route path="/owner/dashboard" element={<OwnerOverviewPage />} />
          <Route path="/owner/properties" element={<OwnerPropertiesPage />} />
          <Route path="/owner/rooms" element={<OwnerRoomsPage />} />
          <Route path="/owner/applications" element={<OwnerApplicationsPage />} />
          <Route path="/owner/bookings" element={<OwnerBookingsPage />} />
          <Route path="/owner/payments" element={<OwnerPaymentsPage />} />
          <Route path="/owner/messages" element={<OwnerMessagesPage />} />
          <Route path="/owner/reviews" element={<OwnerReviewsPage />} />
          <Route path="/owner/analytics" element={<OwnerAnalyticsPage />} />
          <Route path="/owner/settings" element={<OwnerSettingsPage />} />
          <Route path="/owner/properties/new" element={<AddProperty />} />
          <Route path="/owner/applications/:id" element={<OwnerApplications />} />
          <Route path="/student/applications/new" element={<StudentApplication />} />
          <Route path="/student/applications/:id" element={<StudentApplication />} />
          <Route path="/student/notifications" element={<StudentNotificationsPage />} />
          <Route path="/student/*" element={<StudentPortal />} />
          <Route path="/owner/*" element={<OwnerPortal />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
