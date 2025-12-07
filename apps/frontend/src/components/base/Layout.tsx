import { Outlet } from "react-router-dom";

import { Toaster } from "../ui/sonner";

const Layout = () => (
  <main className="px-6 py-8">
    <Outlet />
    <Toaster position="top-center" />
  </main>
);

export default Layout;
