import { SidebarTask } from "@/components/Nav/SidebarTask";
import { Outlet, useLocation } from "react-router";

export default function SidebarTaskLayout() {
  const location = useLocation();
  return (
    <div className="pt-25 text-theme-reverse bg-theme flex flex-col gap-10 mb-15">
      <SidebarTask withEdit={!location.pathname.endsWith("/edit")} />
      <div className="lg:pl-[23%]">
        <Outlet />
      </div>
    </div>
  );
}
