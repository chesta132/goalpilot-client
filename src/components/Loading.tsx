import { LoaderCircle } from "lucide-react";

const Loading = () => {
  return (
    <div className="h-[100dvh] w-full flex items-center justify-center">
      <LoaderCircle size={50} className="animate-spin" color="vartheme-reverse" />
    </div>
  );
};

export default Loading;
