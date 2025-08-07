import { Link } from "react-router";
import { Plus } from "lucide-react";
import ButtonV from "@/components/Inputs/ButtonV";
import clsx from "clsx";
import GoalCard from "@/components/Cards/GoalCard";
import { Empty } from "antd";
import { useUserData } from "@/contexts/UseContexts";
import { useViewportWidth } from "@/hooks/useViewport";
import { useEffect } from "react";

const Dashboard = () => {
  const { data, loading } = useUserData();

  const width = useViewportWidth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      {/* Dashboard */}
      <div className={clsx("px-3 md:px-6 text-theme-reverse bg-theme w-full h-full gap-10 flex flex-col pb-10")}>
        <div className="bg-theme-dark rounded-xl px-3 lg:px-4 py-8 text-theme-reverse shadow-md flex flex-col gap-10">
          <div className="flex flex-col gap-4 relative px-1 lg:px-0">
            <h1 className="text-2xl font-bold font-heading">My Goals</h1>
            <h2 className="font-medium">
              Hi, {data?.fullName.split(" ")[0]}! Ready to {data && data?.goals.length > 0 ? "crush" : "create"} your goals today?
            </h2>
            <div className={clsx("absolute top-0 right-0 bg-theme-darker rounded-full px-3 py-1.5", loading && "animate-shimmer")}>
              <p className={clsx("text-gray text-[14px]", loading && "text-transparent cursor-default")}>{data?.goals.length} goals</p>
            </div>
          </div>
          {width >= 1024 && (
            <ButtonV
              link={{ className: "mx-5 mb-4", to: "/goal/create" }}
              text="Create New Goal"
              icon={<Plus className="bg-transparent" />}
              className="shadow-sm whitespace-nowrap w-full"
            />
          )}
          <div className="flex flex-col gap-6">
            {data?.goals && data?.goals.length > 0 ? (
              data?.goals.map((goal) => (
                <Link to={`/goal/${goal._id}`} key={goal._id} onClickCapture={() => window.scrollTo(0, 0)}>
                  <GoalCard goal={goal} />
                </Link>
              ))
            ) : (
              <Empty className="flex flex-col justify-center" description>
                <p className="text-gray">No Goal Found</p>
                <ButtonV
                  text="Create New Goal"
                  link={{ to: "/goal/create", className: "relative h-12" }}
                  className="absolute left-1/2 top-1/2 -translate-1/2 whitespace-nowrap h-7 shadow-sm"
                />
              </Empty>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
