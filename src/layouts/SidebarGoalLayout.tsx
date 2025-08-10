import { SidebarGoal } from "@/components/Nav/SidebarGoal";
import { useGoalData } from "@/contexts/UseContexts";
import { useViewportWidth } from "@/hooks/useViewport";
import { Outlet, useLocation } from "react-router";

export default function SidebarGoalLayout() {
  const location = useLocation();
  const { data } = useGoalData();
  const width = useViewportWidth();

  return (
    <div className="pt-25 text-theme-reverse bg-theme flex flex-col gap-10 mb-15">
      {(width > 1024 || location.pathname === `/goal/${data._id}`) && (
        <SidebarGoal withEdit={!location.pathname.endsWith("/edit")} withInfo={!location.pathname.endsWith("/info")} />
      )}
      <div className="lg:pl-[23%]">
        <Outlet />
      </div>
    </div>
  );
}
