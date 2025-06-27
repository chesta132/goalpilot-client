import { Outlet, useLocation, useParams } from "react-router";
import Nav from "../components/Nav/Nav";
import { useUserData } from "../contexts/UseContexts";
import useScrollNavigation from "../hooks/useScrollNavigation";
import { useEffect } from "react";

const Layout = () => {
  const { data } = useUserData();
  const { navRef, timelineStatus } = useScrollNavigation(20);
  const location = useLocation();
  const goalId = useParams().goalId;

  useEffect(() => {
    const clear = () => {
      sessionStorage.removeItem("user-id");
      sessionStorage.removeItem("goal-data");
      sessionStorage.removeItem("goal-id");
      sessionStorage.removeItem("task-data");
    };
    if (location.pathname === "/") {
      clear();
    } else if (location.pathname.startsWith("/goal")) {
      sessionStorage.removeItem("task-data");
      sessionStorage.removeItem("user-id");
    } else if (location.pathname.startsWith("/task")) {
      sessionStorage.removeItem("user-id");
    }
  }, [location.pathname]);

  return (
    <div>
      <Nav data={data} param={goalId} scrollNav={{ navRef, timelineStatus }} />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
