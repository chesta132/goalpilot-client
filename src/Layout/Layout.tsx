import { Outlet, useLocation, useParams } from "react-router";
import Nav from "../components/Nav/Nav";
import { useGoalData, useTaskData, useUserData } from "../contexts/UseContexts";
import useScrollNavigation from "../hooks/useScrollNavigation";
import { useEffect } from "react";
import Footer from "@/components/Footer/Footer";
import { decrypt } from "@/utils/cryptoUtils";

const Layout = () => {
  const { data: userData } = useUserData();
  const { clearError: clearGoalError, getData: getGoalData } = useGoalData();
  const { clearError: clearTaskError } = useTaskData();
  const { navRef, timelineStatus } = useScrollNavigation(20);
  const location = useLocation();
  const { goalId } = useParams();

  useEffect(() => {
    // clear error after path changes
    clearGoalError();
    clearTaskError();
    const previewGoal = decrypt(sessionStorage.getItem("preview-goal-data"), { parse: true });
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

    if (previewGoal && !location.pathname.endsWith("/info")) {
      getGoalData(goalId, false);
      if (!location.pathname.endsWith("/edit")) {
        getGoalData(goalId, false);
        sessionStorage.removeItem("preview-goal-data");
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <div>
      <Nav data={userData} param={goalId} scrollNav={{ navRef, timelineStatus }} />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
