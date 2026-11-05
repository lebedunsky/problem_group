import { Navigate, Route, Routes } from "react-router-dom";
import { AdminLayout } from "./layouts/AdminLayout";
import { SiteLayout } from "./layouts/SiteLayout";
import { AboutPage } from "./pages/AboutPage";
import { ContactsPage } from "./pages/ContactsPage";
import { HomePage } from "./pages/HomePage";
import { MaterialsPage } from "./pages/MaterialsPage";
import { MeetingDetailPage } from "./pages/MeetingDetailPage";
import { MeetingsPage } from "./pages/MeetingsPage";
import { NewsDetailPage } from "./pages/NewsDetailPage";
import { NewsPage } from "./pages/NewsPage";
import { ParticipantsPage } from "./pages/ParticipantsPage";
import { PlanPage } from "./pages/PlanPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ResultsPage } from "./pages/ResultsPage";
import { SchedulePage } from "./pages/SchedulePage";
import { DashboardPage } from "./pages/admin/DashboardPage";
import { LoginPage } from "./pages/admin/LoginPage";
import { MaterialsAdmin } from "./pages/admin/MaterialsAdmin";
import { MeetingsAdmin } from "./pages/admin/MeetingsAdmin";
import { NewsAdmin } from "./pages/admin/NewsAdmin";
import { ParticipantsAdmin } from "./pages/admin/ParticipantsAdmin";
import { PlanAdmin } from "./pages/admin/PlanAdmin";
import { RequestsAdmin } from "./pages/admin/RequestsAdmin";
import { ResultsAdmin } from "./pages/admin/ResultsAdmin";
import { ScheduleAdmin } from "./pages/admin/ScheduleAdmin";
import { SettingsAdmin } from "./pages/admin/SettingsAdmin";

export function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/participants" element={<ParticipantsPage />} />
        <Route path="/plan" element={<PlanPage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/meetings" element={<MeetingsPage />} />
        <Route path="/meetings/:id" element={<MeetingDetailPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/news/:id" element={<NewsDetailPage />} />
        <Route path="/materials" element={<MaterialsPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/contacts" element={<ContactsPage />} />
        <Route path="/admin/login" element={<LoginPage />} />
      </Route>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="participants" element={<ParticipantsAdmin />} />
        <Route path="requests" element={<RequestsAdmin />} />
        <Route path="meetings" element={<MeetingsAdmin />} />
        <Route path="plan" element={<PlanAdmin />} />
        <Route path="schedule" element={<ScheduleAdmin />} />
        <Route path="results" element={<ResultsAdmin />} />
        <Route path="news" element={<NewsAdmin />} />
        <Route path="materials" element={<MaterialsAdmin />} />
        <Route path="settings" element={<SettingsAdmin />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
