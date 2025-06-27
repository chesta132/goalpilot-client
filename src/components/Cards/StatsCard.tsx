import clsx from "clsx";
import { type ReactNode } from "react";

type StatsCardProps = {
  icon: ReactNode;
  header: string;
  stats: string | ReactNode;
  className?: string;
  children?: ReactNode;
  classStats?: string;
  loading?: boolean;
};
const StatsCard = ({ icon, header, stats, className, children, classStats, loading }: StatsCardProps) => {
  return (
    <div
      className={clsx(
        "w-full p-4 bg-theme-darker rounded-md shadow-sm flex flex-col gap-5",
        loading && "animate-shimmer text-transparent cursor-default",
        className
      )}
    >
      <div className="flex justify-between items-center w-full">
        <div className="w-[80%]">
          <p className={clsx("text-gray text-[14px]", loading && "text-transparent cursor-default")}>{header}</p>
          <h2 className={clsx("font-heading text-2xl font-bold leading-6", loading && "text-transparent cursor-default", classStats && classStats)}>{stats}</h2>
        </div>
        {icon}
      </div>
      {children}
    </div>
  );
};

export default StatsCard;
