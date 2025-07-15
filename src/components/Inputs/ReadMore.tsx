import clsx from "clsx";
import { useState } from "react";

type ReadMoreProps = {
  text: string;
  className?: string;
  readMoreClass?: string;
};

export const ReadMore = ({ text, className, readMoreClass }: ReadMoreProps) => {
  const [readMore, setReadMore] = useState(false);
  return (
    <p className={clsx(readMore && "overflow-auto", className)}>
      {text.length > 30 ? (
        <>
          {readMore ? text : `${text.substring(0, 30)}...`}
          <br />
          <button
            className={clsx("text-gray cursor-pointer w-fit text-[14px]", readMoreClass)}
            onClick={(e) => {
              e.stopPropagation();
              setReadMore((prev) => !prev);
            }}
          >
            {readMore ? "Read less" : "Read more"}
          </button>
        </>
      ) : (
        text
      )}
    </p>
  );
};
