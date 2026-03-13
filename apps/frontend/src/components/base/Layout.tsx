import { Outlet } from "react-router-dom";

import { Toaster } from "../ui/sonner";

const Layout = () => (
  <main className="min-h-screen px-6 py-8 lg:px-8 xl:px-10 xl:py-0 xl:max-w-[1920px] xl:mx-auto xl:flex xl:flex-row-reverse xl:justify-end xl:items-start xl:gap-12 xl:[&>*:first-child]:flex-1 xl:[&>*:first-child]:w-full xl:[&>*:first-child]:max-w-[1500px] xl:[&>*:first-child]:mx-auto xl:[&>*:first-child]:mt-0 xl:[&>*:first-child]:py-10">
    <Outlet />
    <Toaster position="top-center" />
  </main>
);

export default Layout;
