import { Outlet, useLocation, useParams } from "react-router";
import Nav from "../components/Nav/Nav";
import { useGoalData, useTaskData, useUserData } from "../contexts/UseContexts";
import useScrollNavigation from "../hooks/useScrollNavigation";
import { useEffect } from "react";
import Footer from "@/components/Footer/Footer";
import { defaultTaskData } from "@/utils/defaultData";
import type { GoalData } from "@/types/types";

const Layout = () => {
  const { data: userData, setData: setUserData } = useUserData();
  const { clearError: clearGoalError, getData: getGoalData, data: goalData } = useGoalData();
  const { clearError: clearTaskError, setData: setTaskData } = useTaskData();
  const { navRef, timelineStatus } = useScrollNavigation(20);
  const location = useLocation();
  const { goalId } = useParams();

  useEffect(() => {
    // clear error after path changes
    clearGoalError();
    clearTaskError();
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

    const previewGoal = sessionStorage.getItem("preview-goal-data");
    const previewTask = sessionStorage.getItem("preview-task-data");

    if (!location.pathname.endsWith("/edit") && !location.pathname.endsWith("/info")) {
      if (previewGoal && location.pathname.startsWith("/goal")) {
        getGoalData(goalId, false);
      }
      if (previewTask && location.pathname.startsWith("/task")) {
        setTaskData(defaultTaskData);
      }
      sessionStorage.removeItem("preview-goal-data");
      sessionStorage.removeItem("preview-task-data");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, goalId]);

  useEffect(() => {
    const updatedGoal = userData?.goals?.map((goal) => (goal.id === goalData.id ? goalData : goal)) as GoalData[];
    setUserData((prev) => (prev !== null ? { ...prev, goals: updatedGoal } : null));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goalData]);

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
