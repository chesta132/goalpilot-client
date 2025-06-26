import { SidebarGoal } from "@/components/Nav/SidebarGoal";
import { useGoalData } from "@/contexts/UseContexts";
import clsx from "clsx";
import { useState } from "react";
import { Outlet, useLocation } from "react-router";

type AiInput = {
  value: string;
  error: null | string;
  loading: boolean;
};

export default function SidebarGoalLayout() {
  const location = useLocation();
  const [addTaskAIInput, setAddTaskAIInput] = useState(false);
  const [aiInput, setAiInput] = useState<AiInput>({ value: "", error: null, loading: false });
  const [readMore, setReadMore] = useState({ title: false, desc: false, taskTitle: false });
  const { data } = useGoalData();

  return (
    <div
      className={clsx("pt-22 text-theme-reverse flex flex-col gap-10 mb-15", location.pathname !== `/goal/${data._id}` && "flex-col-reverse pt-0!")}
    >
      <SidebarGoal
        showCreate={location.pathname === `/goal/${data._id}`}
        addTaskAIInput={addTaskAIInput}
        aiInput={aiInput}
        readMore={readMore}
        setAddTaskAIInput={setAddTaskAIInput}
        setAiInput={setAiInput}
        setReadMore={setReadMore}
      />
      <div className="lg:pl-[25%]">
        <Outlet />
      </div>
    </div>
  );
}
