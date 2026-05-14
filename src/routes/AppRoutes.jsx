import { Navigate, Route, Routes } from "react-router-dom";

import LoginPage from "../pages/LoginPage";
import UnifiedOnboardingPage from "../pages/UnifiedOnboardingPage";

const AppRoutes = ({ mode, onToggleMode }) => (
  <Routes>
    <Route path="/login" element={<LoginPage mode={mode} onToggleMode={onToggleMode} />} />
    <Route path="/" element={<Navigate to="/onboarding" replace />} />
    <Route path="/onboarding" element={<UnifiedOnboardingPage />} />
    <Route path="*" element={<Navigate to="/onboarding" replace />} />
  </Routes>
);

export default AppRoutes;
