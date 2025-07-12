import { getBgByStatus } from "@/utils/commonUtils";
import { capitalWord } from "@/utils/stringManip";
import type { GoalData } from "@/utils/types";
import clsx from "clsx";
import { useState } from "react";
import { useNavigate } from "react-router";

type GoalCardCompactProps = {
  data: GoalData;
  className?: string;
};

export const GoalCardCompact = ({ data, className }: GoalCardCompactProps) => {
  const [readMore, setReadMore] = useState({ title: false });
  const navigate = useNavigate();

  return (
    <div
      className={clsx("border relative rounded-lg py-4 px-4 shadow-md bg-theme border-theme-darker gap-1 flex w-full", className)}
      onClick={() => navigate(`/goal/${data.id}`)}
    >
      <div className="flex justify-between w-full">
        <div className="relative flex flex-col gap-2 w-full">
          <h1 className="font-heading font-semibold text-[14px] md:text-[15px] max-w-[90%]">
            {data.title.length > 30 ? (
              <>
                {readMore.title ? capitalWord(data.title) : `${capitalWord(data.title).substring(0, 30)}...`}
                <br />
                <button
                  className="text-gray cursor-pointer w-fit text-[14px] font-normal"
                  onClick={(e) => {
                    e.stopPropagation();
                    setReadMore((prev) => ({ ...prev, title: !prev.title }));
                  }}
                >
                  {readMore.title ? "Read less" : "Read more"}
                </button>
              </>
            ) : (
              capitalWord(data.title)
            )}
          </h1>
          <div className="flex gap-x-3 gap-y-1 text-[11px] md:text-[12px] text-gray items-center flex-wrap">
            <p className={clsx("text-white rounded-full text-[10px] md:text-[11px] px-2 py-1 inline size-fit", getBgByStatus(data.status))}>
              {capitalWord(data.status)}
            </p>
            •<p>{data.progress}% Complete</p>•<p>{data.isPublic ? "Public" : "Non-public"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
