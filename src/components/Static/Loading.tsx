import clsx from "clsx";

export const Loading = ({
  className,
  dotClass,
  ref,
  ...rest
}: { className?: string; dotClass?: string; ref?: React.RefObject<HTMLDivElement | null> } & React.ComponentPropsWithoutRef<"div">) => {
  return (
    <div>
      <div className={clsx("flex space-x-1 justify-center items-center", className)} {...rest} ref={ref}>
        <span className="sr-only">Loading...</span>
        <div className={clsx("size-2 bg-accent rounded-full animate-bounce [animation-delay:-0.3s]", dotClass)}></div>
        <div className={clsx("size-2 bg-accent rounded-full animate-bounce [animation-delay:-0.15s]", dotClass)}></div>
        <div className={clsx("size-2 bg-accent rounded-full animate-bounce", dotClass)}></div>
      </div>
    </div>
  );
};
