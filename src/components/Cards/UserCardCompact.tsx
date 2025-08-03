import { useUserData } from "@/contexts/UseContexts";
import type { SearchProfile, UserData } from "@/types/types";
import clsx from "clsx";
import { UserProfile } from "../Nav/Nav";
import { capitalEachWords, capitalWord } from "@/utils/stringManip";
import { UserMinus2, UserPlus2 } from "lucide-react";

type UserCardCompactProps = {
  user?: UserData | SearchProfile;
  className?: string;
};

export const UserCardCompact = ({ user, className }: UserCardCompactProps) => {
  const { data: userData } = useUserData();
  const data = (user || userData) as UserData | SearchProfile;
  const handleAddFriend = (e: React.MouseEvent<SVGSVGElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // WIP friend system
  };
  const handleUnFriend = (e: React.MouseEvent<SVGSVGElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // WIP friend system
  };
  return (
    <div className={clsx("border relative rounded-lg py-5 px-4 shadow-md bg-theme border-theme-darker gap-1 flex w-full items-center", className)}>
      <UserProfile name={data.fullName} />
      <div className="flex justify-between w-full ml-2">
        <div className="relative flex flex-col w-full">
          <h1 className="font-heading font-semibold text-[14px] md:text-[15px] max-w-[90%]">{capitalWord(data.fullName)}</h1>
          <div className="flex gap-x-2 text-[11px] md:text-[12px] text-gray items-center flex-wrap">
            <p>@{data.username}</p>•
            <p
              className={clsx(
                "bg-theme-darker/60 rounded-full text-[10px] md:text-[11px] px-2 py-1 inline size-fit",
                data.status === "online" ? "text-green-400" : "text-red-600"
              )}
            >
              {capitalWord(data.status)}
            </p>
            {data.status === "offline" && (
              <>
                •<p>{capitalEachWords(data.lastActive.toFormattedString({ includeThisYear: false, includeHour: true }))}</p>
              </>
            )}
          </div>
        </div>
        <div className="absolute right-0 mr-5 flex gap-2">
          {/* WIP add friend */}
          {Math.random() > 0.5 ? (
            <UserPlus2 className="cursor-pointer size-7 transition hover:bg-accent rounded-full p-1" onClick={handleAddFriend} />
          ) : (
            <UserMinus2 className="cursor-pointer size-7 transition hover:bg-accent rounded-full p-1" onClick={handleUnFriend} />
          )}
        </div>
      </div>
    </div>
  );
};
