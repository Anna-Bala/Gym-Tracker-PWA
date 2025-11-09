import { Routes, Route } from "react-router-dom";

import { AuthProvider } from "./contexts/auth/AuthProvider";
import { OnboardingFormProvider } from "./contexts/onboarding/OnboardingFormProvider";
import {
  OnboardingStepActivityLevel,
  OnboardingStepAge,
  OnboardingStepDays,
  OnboardingStepFitnessLevel,
  OnboardingStepFocusArea,
  OnboardingStepGender,
  OnboardingStepHeight,
  OnboardingStepLoading,
  OnboardingStepWeight,
  OnboardingStepWorkoutGoal,
} from "./pages/onboarding";
import Layout from "./components/base/Layout";
import History from "./pages/history/History";
import Login from "./pages/auth/Login";
import PrivateRoute from "./components/base/PrivateRoute";
import Registration from "./pages/auth/Registration";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="login" element={<Login />} />
          <Route path="registration" element={<Registration />} />

          <Route
            element={
              <OnboardingFormProvider>
                <PrivateRoute />
              </OnboardingFormProvider>
            }
          >
            <Route path="/home" element={<div>home</div>} />
            <Route path="/discover" element={<div>discover</div>} />
            <Route path="/report" element={<div>report</div>} />
            <Route path="/history" element={<History />} />
            <Route path="/settings" element={<div>settings</div>} />
            <Route path="/onboarding/1" element={<OnboardingStepGender />} />
            <Route path="/onboarding/2" element={<OnboardingStepFocusArea />} />
            <Route path="/onboarding/3" element={<OnboardingStepAge />} />
            <Route path="/onboarding/4" element={<OnboardingStepHeight />} />
            <Route path="/onboarding/5" element={<OnboardingStepWeight />} />
            <Route path="/onboarding/6" element={<OnboardingStepActivityLevel />} />
            <Route path="/onboarding/7" element={<OnboardingStepWorkoutGoal />} />
            <Route path="/onboarding/8" element={<OnboardingStepFitnessLevel />} />
            <Route path="/onboarding/9" element={<OnboardingStepDays />} />
            <Route path="/onboarding/loading" element={<OnboardingStepLoading />} />
          </Route>

          <Route path="*" element={<p>Page not found!</p>} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
