import { Trash2Icon } from "lucide-react";
import ButtonV from "../Inputs/ButtonV";
import toCapitalize from "@/utils/toCapitalize";

type DeletePopupProps = {
  deletes: () => void;
  setClose: () => void;
  item: "task" | "goal";
};

export const DeletePopup = ({ setClose, deletes, item }: DeletePopupProps) => {
  return (
    <div className="fixed z-[99999] px-10 max-w-[780px] text-[13px] top-1/2 left-1/2 -translate-1/2 w-full h-full backdrop-blur-[2px] flex items-center justify-center">
      <div className="px-6 py-10 bg-theme-dark text-theme-reverse w-full rounded-2xl shadow-lg gap-7 flex flex-col">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-red-200 p-2 rounded-full size-10">
              <Trash2Icon className="stroke-red-400" />
            </div>
            <h1 className="font-heading font-semibold text-[16px]">Delete {toCapitalize(item)}</h1>
          </div>
        </div>
        <div>
          <h2 className="text-[14px] text-theme-reverse-darker">Are you sure you want to delete this {item}?</h2>
        </div>
        <div className="flex justify-end gap-3">
          <ButtonV onClick={setClose} text="Cancel" className="shadow-none !py-2 !px-5 !text-theme-reverse" />
          <ButtonV
            onClick={() => {
              deletes();
              setClose();
            }}
            text="Delete Task"
            className="bg-transparent shadow-none border border-red-700 hover:bg-red-700 !py-2 !px-5 !text-theme-reverse"
            icon={<Trash2Icon size={14} />}
          />
        </div>
      </div>
    </div>
  );
};
