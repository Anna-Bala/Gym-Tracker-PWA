import { Outlet } from "react-router-dom";

const Layout = () => (
  <main className="px-6 py-8">
    <Outlet />
  </main>
);

export default Layout;
