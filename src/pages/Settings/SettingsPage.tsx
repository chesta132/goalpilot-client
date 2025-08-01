import TaskCard from "@/components/Cards/TaskCard";
import TaskCardCompact from "@/components/Cards/TaskCardCompact";
import type { ThemeSettings } from "@/contexts/ThemeContext";
import { useTheme } from "@/contexts/UseContexts";
import { defaultTaskData } from "@/utils/defaultData";
import { difficultyOptions, statusOptions } from "@/utils/selectOptions";
import { capitalEachWords } from "@/utils/stringManip";
import { ColorPicker, Select, Switch } from "antd";
import clsx from "clsx";
import { useEffect, useState } from "react";

const previewTaskDataRegular = {
  ...defaultTaskData,
  id: "previewer",
  task: "Regular Card",
  description: "Preview regular task appereance",
  createdAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
};

const previewTaskDataCompact = {
  ...defaultTaskData,
  id: "previewer",
  task: "Compact Card",
  description: "Preview compact task appereance",
  createdAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
};

export const SettingsPage = () => {
  const [taskDataRegular, setTaskDataRegular] = useState(previewTaskDataRegular);
  const [taskDataCompact, setTaskDataCompact] = useState(previewTaskDataCompact);

  const { updateSettings, settings } = useTheme();
  const settingData = localStorage.getItem("settings");
  if (!settingData) updateSettings({});

  const handleChangeTheme = () => {
    updateSettings({ themeMode: settings.themeMode === "light" ? "dark" : "light" });
  };

  const handleTaskCardClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, selected: ThemeSettings["taskCard"]) => {
    e.stopPropagation();
    updateSettings({ taskCard: selected });
  };

  const handleDefaultValues = <T extends "defaultGoalStatus" | "defaultTaskDifficulty">(field: T, value: ThemeSettings[T]) => {
    updateSettings({ [field]: value });
  };

  const handleShowGoalShortcut = () => {
    updateSettings({ showGoalsShortcut: !settings.showGoalsShortcut });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="px-3 md:px-6 flex flex-col gap-8 bg-theme text-theme-reverse text-[14px] pb-25">
      <div className="bg-theme-dark rounded-2xl shadow-xl">
        <div className="p-6.5 border-b border-gray">
          <h1 className="font-heading text-[18px] font-bold">Appearance</h1>
        </div>
        <div className="p-6 flex flex-col">
          <div className="flex flex-col gap-1.5">
            <p>Accent Color</p>
            <div className="flex items-center justify-between">
              <ColorPicker
                showText
                defaultValue={settings.accent}
                className="colorpicker"
                onChangeComplete={(e) => updateSettings({ accent: e.toCssString() })}
              />
              <div className="flex gap-2">
                <div className="size-8 rounded-full bg-accent-soft" />
                <div className="size-8 rounded-full bg-accent" />
                <div className="size-8 rounded-full bg-accent-strong" />
              </div>
            </div>
          </div>
          <div className="w-full h-[1px] bg-theme my-3" />
          <div className="flex justify-between items-center">
            <div>
              <p>Dark Mode</p>
              <span className="text-[12px] text-gray">Toggle between light and dark theme</span>
            </div>
            <Switch
              value={settings.themeMode === "dark"}
              style={{ backgroundColor: settings.themeMode === "dark" ? "var(--accent)" : "var(--theme-darker)" }}
              onChange={handleChangeTheme}
            />
          </div>
          <div className="w-full h-[1px] bg-theme my-3 hidden lg:flex" />
          <div className="justify-between items-center hidden lg:flex">
            <div>
              <p>Show Goal Shortcut</p>
              <span className="text-[12px] text-gray">Show goal shortcut on sidebar</span>
            </div>
            <Switch
              value={settings.showGoalsShortcut}
              style={{ backgroundColor: settings.showGoalsShortcut ? "var(--accent)" : "var(--theme-darker)" }}
              onChange={handleShowGoalShortcut}
            />
          </div>
          <div className="w-full h-[1px] bg-theme my-3" />
          <div className="gap-2 flex flex-col">
            <p className="text-[15px] font-medium">Task Appearance</p>
            <div className="flex flex-col gap-3">
              <div
                className={clsx("p-1 bg rounded-xl bg-transparent cursor-pointer", settings.taskCard === "regular" && "bg-accent-strong!")}
                onClick={(e) => handleTaskCardClick(e, "regular")}
              >
                <TaskCard task={taskDataRegular} index={0} preview={{ setTask: setTaskDataRegular }} className="border-none!" />
              </div>
              <div
                className={clsx("p-1 bg rounded-xl bg-transparent cursor-pointer", settings.taskCard === "compact" && "bg-accent-strong!")}
                onClick={(e) => handleTaskCardClick(e, "compact")}
              >
                <TaskCardCompact task={taskDataCompact} index={0} preview={{ setTask: setTaskDataCompact }} className="border-none!" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-theme-dark rounded-2xl shadow-xl">
        <div className="p-6.5 border-b border-gray">
          <h1 className="font-heading text-[18px] font-bold">Utilities</h1>
        </div>
        <div className="p-6 flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[15px] font-medium">Default Values</p>
              <span className="text-[13px] text-gray">Default value while create goal or task</span>
            </div>
            <div className="flex flex-col gap-1 items-end">
              <Select
                value={settings.defaultGoalStatus || undefined}
                onChange={(e) => handleDefaultValues("defaultGoalStatus", e ?? "")}
                placement="topLeft"
                placeholder={"Goal status"}
                className="select !size-fit"
                options={statusOptions.slice(0, -2).map((option) => ({ value: option, label: capitalEachWords(option) }))}
                allowClear
              />
              <Select
                value={settings.defaultTaskDifficulty || undefined}
                onChange={(e) => handleDefaultValues("defaultTaskDifficulty", e ?? "")}
                placement="bottomLeft"
                placeholder={"Task difficulty"}
                className="select !size-fit"
                options={difficultyOptions.map((option) => ({ value: option, label: capitalEachWords(option) }))}
                allowClear
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
