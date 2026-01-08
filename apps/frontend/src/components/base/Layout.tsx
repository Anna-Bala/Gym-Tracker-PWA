import { Outlet } from "react-router-dom";

import { Toaster } from "../ui/sonner";

const Layout = () => (
  <main className="px-6 py-8 lg:flex lg:flex-row-reverse lg:justify-end lg:[&>*:first-child]:flex-1 lg:[&>*:first-child]:max-w-[750px] lg:[&>*:first-child]:mx-auto lg:[&>*:first-child]:mt-8">
    <Outlet />
    <Toaster position="top-center" />
  </main>
);

export default Layout;
