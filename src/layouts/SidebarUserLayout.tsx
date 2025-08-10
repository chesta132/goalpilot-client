import { SidebarUser } from "@/components/Nav/SidebarUser";
import { useViewportWidth } from "@/hooks/useViewport";
import clsx from "clsx";
import { Outlet, useLocation } from "react-router";

export default function SidebarUserLayout() {
  const location = useLocation();
  const width = useViewportWidth();

  return (
    <div className={clsx("pt-25 text-theme-reverse bg-theme flex flex-col gap-10 mb-15")}>
      {(width > 1024 || location.pathname === "/") && <SidebarUser />}
      <div className="lg:pl-[23%]">
        <Outlet />
      </div>
    </div>
  );
}
