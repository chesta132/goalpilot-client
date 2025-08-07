import { getBgByStatus } from "@/utils/commonUtils";
import { capitalWord } from "@/utils/stringManip";
import type { GoalData } from "@/types/types";
import clsx from "clsx";
import { Link } from "react-router";
import { ReadMore } from "../Inputs/ReadMore";

type GoalCardCompactProps = {
  data: GoalData;
  className?: string;
};

export const GoalCardCompact = ({ data, className }: GoalCardCompactProps) => {
  return (
    <Link to={`/goal/${data.id}`} className={clsx("relative rounded-lg py-4 px-4 shadow-md bg-theme gap-1 flex w-full", className)}>
      <div className="flex justify-between w-full">
        <div className="relative flex flex-col gap-2 w-full">
          <ReadMore text={capitalWord(data.title)} className="font-heading font-semibold text-[14px] md:text-[15px] max-w-[90%]" />
          <div className="flex gap-x-3 gap-y-1 text-[11px] md:text-[12px] text-gray items-center flex-wrap">
            <p
              className={clsx(
                "bg-theme-darker/60 text-white rounded-full text-[10px] md:text-[11px] px-2 py-1 inline size-fit",
                getBgByStatus(data.status)
              )}
            >
              {capitalWord(data.status)}
            </p>
            •<p>{data.progress.toFixed(0)}% Complete</p>•<p>{data.isPublic ? "Public" : "Non-public"}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};
