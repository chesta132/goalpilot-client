import { useFriend, useUserData } from "@/contexts/UseContexts";
import type { SearchProfile, UserData } from "@/types/types";
import clsx from "clsx";
import { UserProfile } from "../Nav/Nav";
import { capitalEachWords, capitalWord } from "@/utils/stringManip";
import { User, UserCheck2, UserPlus2, UserRoundCogIcon } from "lucide-react";
import { useState } from "react";

type UserCardCompactProps = {
  user?: UserData | SearchProfile;
  className?: string;
};

export const UserCardCompact = ({ user, className }: UserCardCompactProps) => {
  const { data: userData } = useUserData();
  const { requestFriend, find } = useFriend();
  const data = (user || userData) as UserData | SearchProfile;
  const [friend, setFriend] = useState(find({ friendId: data.id }));

  const handleAddFriend = async (e: React.MouseEvent<SVGSVGElement>) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setFriend((prev) => prev && { ...prev, status: "PENDING" });
      if (data?.id) await requestFriend(data?.id);
    } catch {
      setFriend(undefined);
    }
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
          {userData?.id === data.id ? (
            <User className="size-7 rounded-md p-1 bg-accent" />
          ) : friend ? (
            friend.status === "FRIEND" ? (
              <UserCheck2 className="size-7 rounded-md p-1 bg-accent-soft" />
            ) : (
              <UserRoundCogIcon className="size-7 rounded-md p-1 bg-accent-strong" />
            )
          ) : (
            <UserPlus2 className="cursor-pointer size-7 transition hover:bg-accent rounded-md p-1" onClick={handleAddFriend} />
          )}
        </div>
      </div>
    </div>
  );
};
