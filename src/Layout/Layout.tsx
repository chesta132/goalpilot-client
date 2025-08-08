import { Outlet, useLocation, useParams } from "react-router";
import Nav from "../components/Nav/Nav";
import { useFriend, useGoalData, useSearch, useTaskData, useTheme, useUserData } from "../contexts/UseContexts";
import useScrollNavigation from "../hooks/useScrollNavigation";
import { useEffect, useMemo, useState } from "react";
import Footer from "@/components/Static/Footer";
import { defaultTaskData } from "@/utils/defaultData";
import type { GoalData } from "@/types/types";
import ErrorPopup from "@/components/Popups/ErrorPopup";
import { generateAccentColors } from "@/utils/colorUtils";

const Layout = () => {
  const [isError, setIsError] = useState(false);

  const { setData: setUserData, error: userError, clearUserError } = useUserData();
  const { clearGoalError, getData: getGoalData, data: goalData, error: goalError } = useGoalData();
  const { clearTaskError, setData: setTaskData, error: taskError } = useTaskData();
  const { error: searchError, clearSearchError } = useSearch();
  const { error: friendError, clearFriendError } = useFriend();
  const { navRef, timelineStatus } = useScrollNavigation(20);
  const { setToDefault, settings, updateSettings } = useTheme();

  const location = useLocation();
  const path = location.pathname;
  const { goalId } = useParams();
  const errors = [userError, goalError, taskError, searchError, friendError];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const clearErrors = useMemo(() => [clearUserError, clearGoalError, clearTaskError, clearSearchError, clearFriendError], []);

  useEffect(() => {
    // clear error after path changes
    clearErrors.map((clearError) => clearError());
    const clear = () => {
      sessionStorage.removeItem("goal-data");
      sessionStorage.removeItem("goal-id");
      sessionStorage.removeItem("task-data");
    };

    if (path === "/") {
      clear();
    } else if (path.startsWith("/goal")) {
      sessionStorage.removeItem("task-data");
    }

    const previewGoal = sessionStorage.getItem("preview-goal-data");
    const previewTask = sessionStorage.getItem("preview-task-data");

    if (!path.endsWith("/edit") && !path.endsWith("/info")) {
      if (previewGoal && path.startsWith("/goal")) {
        getGoalData(goalId, false);
      }
      if (previewTask && path.startsWith("/task")) {
        setTaskData(defaultTaskData);
      }
      sessionStorage.removeItem("preview-goal-data");
      sessionStorage.removeItem("preview-task-data");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, goalId, clearErrors]);
  
  useEffect(() => {
    if (goalData.color && goalData.color !== settings.goalAccent && (path.startsWith("/goal") || path.startsWith("/task"))) {
      const generatedColors = generateAccentColors(goalData.color);
      const accentToUpdate = {
        goalAccent: generatedColors.accent,
        goalAccentSoft: generatedColors.accentSoft,
        goalAccentStrong: generatedColors.accentStrong,
      };
      updateSettings(accentToUpdate);
    }
    else if (!path.startsWith("/goal") && !path.startsWith("/task")) setToDefault({ goalAccent: 1, goalAccentSoft: 1, goalAccentStrong: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goalData.color, settings.goalAccent, path]);

  useEffect(() => {
    setUserData((prev) => {
      if (!prev) return null;
      const updatedGoal = prev.goals?.map((goal) => (goal.id === goalData.id ? goalData : goal)) as GoalData[];
      return { ...prev, goals: updatedGoal };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goalData]);

  const handleCloseError = () => {
    clearErrors.map((clearError) => clearError());
    setIsError(false);
  };

  return (
    <div>
      {errors.map((error, index) => {
        if (error?.error && !isError) {
          setIsError(true);
          return <ErrorPopup error={error} key={error.error.code || index} onClose={handleCloseError} />;
        }
      })}
      <Nav param={goalId} scrollNav={{ navRef, timelineStatus }} />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
