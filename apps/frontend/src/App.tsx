import { Routes, Route } from "react-router-dom";

import { AuthProvider } from "./contexts/auth/AuthProvider";
import { ThemeProvider } from "./contexts/theme/ThemeProvider";
import { OnboardingFormProvider } from "./contexts/onboarding/OnboardingFormProvider";
import { WorkoutPlanFormProvider } from "./contexts/workoutPlan/WorkoutPlanFormProvider";
import { ScrollToTop } from "./components/ScrollToTop";
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
import BodyMetricsSettings from "./pages/settings/BodyMetricsSettings";
import ChangePassword from "./pages/settings/ChangePassword";
import DiscoverExercises from "./pages/discover/DiscoverExercises";
import History from "./pages/history/History";
import Home from "./pages/home/Home";
import Layout from "./components/base/Layout";
import Login from "./pages/auth/Login";
import PrivateRoute from "./components/base/PrivateRoute";
import ProfileSettings from "./pages/settings/ProfileSettings";
import Registration from "./pages/auth/Registration";
import Report from "./pages/report/Report";
import Settings from "./pages/settings/Settings";
import WorkoutPlanForm from "./pages/workoutPlans/WorkoutPlanForm";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ScrollToTop />

        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="login" element={<Login />} />
            <Route path="registration" element={<Registration />} />

            <Route
              element={
                <OnboardingFormProvider>
                  <WorkoutPlanFormProvider>
                    <PrivateRoute />
                  </WorkoutPlanFormProvider>
                </OnboardingFormProvider>
              }
            >
              <Route path="/home" element={<Home />} />
              <Route path="/discover" element={<DiscoverExercises />} />
              <Route path="/report" element={<Report />} />
              <Route path="/history" element={<History />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/settings/profile" element={<ProfileSettings />} />
              <Route path="/settings/profile/password" element={<ChangePassword />} />
              <Route path="/settings/metrics" element={<BodyMetricsSettings />} />
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
              <Route path="/workout-plan" element={<WorkoutPlanForm />} />
            </Route>

            <Route path="*" element={<p>Page not found!</p>} />
          </Route>
        </Routes>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
