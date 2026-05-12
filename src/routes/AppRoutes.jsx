import { Navigate, Route, Routes } from "react-router-dom";

import UnifiedOnboardingPage from "../pages/UnifiedOnboardingPage";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/onboarding" replace />} />
    <Route path="/onboarding" element={<UnifiedOnboardingPage />} />
    <Route path="*" element={<Navigate to="/onboarding" replace />} />
  </Routes>
);

export default AppRoutes;
