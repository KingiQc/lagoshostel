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
import Dashboard from "./pages/Dashboard";
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
          <Route path="/how-it-works" element={<PublicPage />} />
          <Route path="/hostels/:id" element={<HostelDetails />} />
          <Route path="/booking/checkout" element={<BookingCheckout />} />
          <Route path="/student/bookings/:id" element={<BookingDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/owner/dashboard" element={<OwnerDashboard />} />
          <Route path="/owner/properties/new" element={<AddProperty />} />
          <Route path="/owner/applications/:id" element={<OwnerApplications />} />
          <Route path="/owner/applications" element={<OwnerApplications />} />
          <Route path="/student/applications/new" element={<StudentApplication />} />
          <Route path="/student/applications/:id" element={<StudentApplication />} />
          <Route path="/student/applications" element={<StudentOperations />} />
          <Route path="/student/payments" element={<StudentOperations />} />
          <Route path="/student/messages" element={<StudentOperations />} />
          <Route path="/student/notifications" element={<StudentOperations />} />
          <Route path="/student/profile" element={<StudentOperations />} />
          <Route path="/student/maintenance" element={<StudentOperations />} />
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
