import { Outlet, useParams } from "react-router";
import Nav from "./components/Nav/Nav";
import { useUserData } from "./contexts/UseContexts";
import useScrollNavigation from "./hooks/useScrollNavigation";

const Layout = () => {
  const { data } = useUserData();
  const { navRef, timelineStatus } = useScrollNavigation(20);
  const goalId = useParams().goalId;

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
