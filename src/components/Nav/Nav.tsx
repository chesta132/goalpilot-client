import { useEffect, useState } from "react";
import { Squash as Hamburger } from "hamburger-react";
import { Link } from "react-router";
import { Search, Settings } from "lucide-react";
import { useViewportWidth } from "../../hooks/useViewport";
import useScrollNavigation from "../../hooks/useScrollNavigation";
import clsx from "clsx";
import { useUserData } from "@/contexts/UseContexts";

type scrollNav = {
  navRef: React.RefObject<null>;
  timelineStatus: boolean;
};

type NavProps = {
  param?: string;
  showNavbar?: boolean;
  scrollNav?: scrollNav;
};

const Nav = ({ param, showNavbar, scrollNav }: NavProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const width = useViewportWidth();
  const defaultScrollNav = useScrollNavigation();
  const { navRef, timelineStatus } = scrollNav || defaultScrollNav;

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

  return (
    <nav>
      <div
        ref={navRef}
        className="bg-theme py-2 lg:py-4 text-theme-reverse justify-between shadow-[0_5px_10px_-3px] shadow-theme-reverse-darker/20 pr-4 items-center fixed flex top-0 left-0 w-full z-50"
      >
        <div className="flex items-center">
          <div className={clsx("lg:hidden", !showNavbar && "opacity-0 w-0 -z-10")}>
            <Hamburger toggled={isOpen} toggle={setIsOpen} size={24} />
          </div>
          <Link to={"/"} className="text-[18px] font-heading font-bold leading-7 text-center ml-4">
            <span className="text-primary">Goal</span>Pilot
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link className="cursor-pointer bg-none border-none" to={"/search"}>
            <Search />
          </Link>
          <Link to="/profile">
            <UserProfile />
          </Link>
          <Link to="/settings">
            <Settings />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export const UserProfile = ({ name }: { name?: string }) => {
  const { getProfileInitial } = useUserData();
  const profileName = getProfileInitial(name);
  return <div className="bg-[#66b2ff] text-white rounded-full size-8 text-[14px] flex items-center justify-center">{profileName.toUpperCase()}</div>;
};

export default Nav;
