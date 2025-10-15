import { Routes, Route } from "react-router-dom";

import { AuthProvider } from "./contexts/auth/AuthProvider";
import Layout from "./components/base/Layout";
import Login from "./pages/Login";
import PrivateRoute from "./components/base/PrivateRoute";
import Registration from "./pages/Registration";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="login" element={<Login />} />
          <Route path="registration" element={<Registration />} />

          <Route element={<PrivateRoute />}>
            <Route path="/home" element={<div>home</div>} />
          </Route>

          <Route path="*" element={<p>Page not found!</p>} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
