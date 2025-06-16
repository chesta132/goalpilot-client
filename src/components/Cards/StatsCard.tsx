import clsx from "clsx";
import type { ReactNode } from "react";

type StatsCardProps = {
  icon: React.ReactNode;
  header: string;
  stats: string;
  className?: string;
  children?: ReactNode;
  classStats?: string;
};
const StatsCard = ({ icon, header, stats, className, children, classStats }: StatsCardProps) => {
  return (
    <div className={clsx("w-full p-4 bg-theme-darker rounded-md shadow-sm flex flex-col gap-5", className)}>
      <div className="flex justify-between items-center w-full">
        <div className="w-[80%]">
          <p className="text-gray text-[14px]">{header}</p>
          <h2 className={clsx("font-heading text-2xl font-bold", classStats && classStats)}>{stats}</h2>
        </div>
        {icon}
      </div>
      {children}
    </div>
  );
};

export default StatsCard;
