import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

import { authFetch } from "@/lib/fetchClient";
import { useAuth } from "@/contexts/auth/useAuth";
import GoogleIcon from "@icons/google.svg?react";

const GoogleAuth = () => {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      const response = await authFetch("/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ code: codeResponse.code }),
      });

      if (!response.ok) console.log("XD");

      const responseData = await response.json();

      refreshUser();

      if (responseData.onboardingFilled) {
        navigate("/home");
      } else {
        navigate("/onboarding/1");
      }
    },
    flow: "auth-code",
  });

  return (
    <button className="google-btn" onClick={handleGoogleLogin} type="button">
      <GoogleIcon />
      Continue with Google
    </button>
  );
};

export default GoogleAuth;
