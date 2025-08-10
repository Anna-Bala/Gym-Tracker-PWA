import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Layout from "./components/base/Layout";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="login" element={<Login />} />
        <Route path="registration" element={<Registration />} />
        <Route path="*" element={<p>Page not found!</p>} />
      </Route>
    </Routes>
  );
}

export default App;
