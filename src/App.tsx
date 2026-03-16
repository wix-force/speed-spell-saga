import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import PracticePage from "./pages/PracticePage";
import ContestListPage from "./pages/ContestListPage";
import ContestDetailPage from "./pages/ContestDetailPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFound from "./pages/NotFound";

// Admin
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminContestsPage from "./pages/admin/AdminContestsPage";
import AdminContestCreatePage from "./pages/admin/AdminContestCreatePage";
import AdminContestDetailPage from "./pages/admin/AdminContestDetailPage";
import AdminPassagesPage from "./pages/admin/AdminPassagesPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminAnalyticsPage from "./pages/admin/AdminAnalyticsPage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes with Navbar */}
          <Route path="/" element={<><Navbar /><HomePage /></>} />
          <Route path="/practice" element={<><Navbar /><PracticePage /></>} />
          <Route path="/contest" element={<><Navbar /><ContestListPage /></>} />
          <Route path="/contest/:id" element={<><Navbar /><ContestDetailPage /></>} />
          <Route path="/leaderboard" element={<><Navbar /><LeaderboardPage /></>} />
          <Route path="/profile" element={<><Navbar /><ProfilePage /></>} />
          <Route path="/login" element={<><Navbar /><LoginPage /></>} />
          <Route path="/register" element={<><Navbar /><RegisterPage /></>} />

          {/* Admin routes with AdminLayout */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="contests" element={<AdminContestsPage />} />
            <Route path="contests/create" element={<AdminContestCreatePage />} />
            <Route path="contests/:id" element={<AdminContestDetailPage />} />
            <Route path="passages" element={<AdminPassagesPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="analytics" element={<AdminAnalyticsPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>

          <Route path="*" element={<><Navbar /><NotFound /></>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
