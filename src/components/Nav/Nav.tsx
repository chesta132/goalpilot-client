import { useEffect, useState } from "react";
import { Squash as Hamburger } from "hamburger-react";
import { Link } from "react-router";
import { Settings } from "lucide-react";
import { useViewportWidth } from "../../hooks/useViewport";
import useScrollNavigation from "../../hooks/useScrollNavigation";
import type { UserData } from "../../utils/types";
import clsx from "clsx";
import { Switch } from "antd";
import { getSettings, setSettings, setTheme } from "@/utils/setTheme";

type scrollNav = {
  navRef: React.RefObject<null>;
  timelineStatus: boolean;
};

type NavProps = {
  data?: UserData | null;
  param?: string;
  showNavbar?: boolean;
  scrollNav?: scrollNav;
};

const Nav = ({ data, param, showNavbar, scrollNav }: NavProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const width = useViewportWidth();
  const defaultScrollNav = useScrollNavigation();
  const { navRef, timelineStatus } = scrollNav || defaultScrollNav;
  const [themeValue, setThemeValue] = useState(getSettings().lightDark === "light");

  // Open permanently the menu on larger screens
  useEffect(() => {
    if (width >= 1024) {
      setIsOpen(true);
    }
  }, [width]);

  // Close the menu when the user navigates to a different goal
  useEffect(() => {
    if (width < 1024) setIsOpen(false);
  }, [param, width]);

  // Close the menu when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (width < 1024 && target && !target.closest("nav") && !target.closest(".navbar")) {
        setIsOpen(false);
      }
    };

    document.body.addEventListener("click", handleClickOutside);
    return () => {
      document.body.removeEventListener("click", handleClickOutside);
    };
  }, [width]);

  // Close the menu when the user scrolls
  useEffect(() => {
    if (timelineStatus && width >= 1024) setIsOpen(true);
    else if (timelineStatus) setIsOpen(false);
  }, [timelineStatus, width]);

  const handleChangeTheme = (value: boolean) => {
    const settings = getSettings();
    if (value) {
      localStorage.setItem("settings", JSON.stringify({ ...settings, lightDark: "light" }));
    } else localStorage.setItem("settings", JSON.stringify({ ...settings, lightDark: "dark" }));
    setSettings();
    setTheme();
    setThemeValue(getSettings().lightDark === "light");
  };

  return (
    <nav>
      <div
        ref={navRef}
        className="bg-theme py-2 lg:py-4 text-theme-reverse justify-between shadow-md pr-4 items-center fixed flex top-0 left-0 w-full z-50"
      >
        <div className="flex items-center">
          <div className={clsx("lg:hidden", !showNavbar && "opacity-0 w-0 -z-10")}>
            <Hamburger toggled={isOpen} toggle={setIsOpen} size={24} />
          </div>
          <p className="text-[18px] font-heading font-bold leading-7 text-center ml-4">
            <span className="text-accent">Goal</span>Pilot
          </p>
        </div>
        <div className="flex items-center">
          {/* DEBUG ONLY */}
          <Switch value={themeValue} onChange={(e) => handleChangeTheme(e)} />
          <Link to="/profile" className="hover:text-accent ml-4">
            <div className="bg-accent text-white rounded-full w-8 h-8 flex items-center justify-center">
              {data && data.fullName && data.fullName[0].toUpperCase()}
            </div>
          </Link>
          <Link to="/settings" className="ml-4">
            <Settings />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
