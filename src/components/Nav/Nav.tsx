import { useEffect, useState } from "react";
import { Squash as Hamburger } from "hamburger-react";
import { Link } from "react-router";
import { Settings } from "lucide-react";
import { useViewportWidth } from "../../../hooks/useViewport";
import useScrollNavigation from "../../../hooks/useScrollNavigation";
import type { UserData } from "../../../utils/types";

type NavProps = {
  data?: UserData | null;
  param?: string;
}

const Nav = ({ data, param }: NavProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const width = useViewportWidth();
  const { navRef, timelineStatus } = useScrollNavigation();

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
    if (timelineStatus) setIsOpen(false);
    else if (width >= 1024) setIsOpen(true);
  }, [timelineStatus, width]);

  return (
    <div>
      <nav
        ref={navRef}
        className="bg-(--theme) py-2 lg:py-4 text-(--theme-reverse) justify-between shadow-md pr-4 items-center fixed flex top-0 left-0 w-full z-50"
      >
        <div className="flex items-center">
          <div className="lg:hidden">
            <Hamburger toggled={isOpen} toggle={setIsOpen} size={24} />
          </div>
          <p className="text-[18px] font-bold leading-7 text-center ml-4">
            <span className="text-(--accent)">Goal</span>Pilot
          </p>
        </div>
        <div className="flex items-center">
          <Link to="/profile" className="hover:text-(--accent) ml-4">
            <div className="bg-(--accent) text-(--theme) rounded-full w-8 h-8 flex items-center justify-center">
              {data && data.fullName && data.fullName[0].toUpperCase()}
            </div>
          </Link>
          <Link to="/settings" className="hover:text-(--accent) ml-4">
            <Settings />
          </Link>
        </div>
      </nav>
      <div
        className={`fixed navbar left-0 top-16 h-[100dvh] w-[50%] md:w-[35%] lg:w-[20%] px-4 bg-(--theme) z-40 ${
          isOpen ? "-translate-x-0" : "-translate-x-[100%]"
        } transition-transform duration-500 ease-in-out shadow-md`}
      >
        <h1 className="navbar text-[20px] font-bold mt-4">My Goals</h1>
        {data && data.goals && data.goals.length > 0 ? (
          <div className="mt-2 flex flex-col gap-3">
            {data.goals.map((goal) => (
              <Link to={`/goal/${goal._id}`} className="text-(--theme-reverse)" key={goal._id}>
                <div
                  className={`p-3.5 gap-1 flex flex-col rounded-lg border-2 ${
                    goal._id === param ? "border-(--accent) bg-(--accent)/[0.2]" : "border-(--theme-darker)"
                  } `}
                >
                  <p className="text-[14px]">{goal.title}</p>
                  <div>
                    <p className="text-[12px] text-(--gray)">{goal.progress}%</p>
                    <div className="bg-(--theme-darker) h-1.5 rounded-2xl">
                      <div className="bg-(--accent) h-1.5 rounded-2xl" style={{ width: `${goal.progress}%` }}></div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-2">No goals found.</p>
        )}
      </div>
    </div>
  );
};

export default Nav;
