import clsx from "clsx";

type StatsCardProps = {
  icon: React.ReactNode;
  header: string;
  stats: string;
  className?: string;
};
const StatsCard = ({ icon, header, stats, className }: StatsCardProps) => {
  return (
    <div className={clsx("w-full flex items-center justify-between p-4 bg-theme-darker rounded-md shadow-sm", className)}>
      <div>
        <p className="text-gray text-[14px]">{header}</p>
        <h2 className="font-heading text-2xl font-bold">{stats}</h2>
      </div>
      {icon}
    </div>
  );
};

export default StatsCard;
