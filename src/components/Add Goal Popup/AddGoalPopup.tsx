import { X } from "lucide-react";
import Input from "../Input";
import clsx from "clsx";
import TextArea from "../TextArea";
import { ColorPicker, DatePicker, Switch } from "antd";
import { useEffect, useState } from "react";

type AddGoalPopupProps = {
  appear?: boolean;
  setAppear?: React.Dispatch<React.SetStateAction<boolean>>;
};

const AddGoalPopup = ({ appear, setAppear }: AddGoalPopupProps) => {
  const [value, setValue] = useState({
    title: "",
    description: "",
    targetDate: "",
    color: "#66b2ff",
    isPublic: true,
  });

  useEffect(() => {
    const handleToggle = () => {
      document.body.classList.toggle("overflow-hidden");
    };
    handleToggle();
  }, [appear]);
  return (
    <div
      className={clsx(
        "hidden h-[100dvh] fixed w-full px-8 justify-center items-center z-[100] transition-all",
        appear && "!flex backdrop-blur-[2px] backdrop-brightness-90"
      )}
    >
      <div className="px-6 py-10 bg-(--theme) max-w-[580px] text-(--theme-reverse) w-full rounded-2xl shadow-lg">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold font-heading">Create New Goal</h1>
          <X color="var(--gray)" className="cursor-pointer" size={20} onClick={() => setAppear && setAppear(false)} />
        </div>
        <div className="flex flex-col gap-3">
          <Input label="Goal Title" placeholder="Enter your goal title" onChange={(e) => setValue((prev) => ({ ...prev, title: e.target.value }))} />
          <TextArea
            label="Descripton"
            placeholder="Enter description of goal"
            onChange={(e) => setValue((prev) => ({ ...prev, description: e.target.value }))}
          />
          <div className="flex flex-1/2 items-center gap-6">
            <DatePicker
              className="w-full h-12"
              placeholder="Choose target date of goal"
              onChange={(e) => setValue((prev) => ({ ...prev, targetDate: e.format() }))}
            />
            <div className="flex flex-col">
              <p className="text-(--gray) whitespace-nowrap text-[13px]">Color Theme</p>
              <ColorPicker
                showText
                format="hex"
                value={value.color}
                onChangeComplete={(e) => setValue((prev) => ({ ...prev, color: e.toHexString() }))}
              />
            </div>
          </div>
          <div className="flex justify-between items-center bg-(--theme-darker)/30 border-(--gray) rounded-[8px] p-4.5">
            <div>
              <h2 className="text-[14px] font-medium">Make Public</h2>
              <p className="text-(--gray) text-[12px]">Allow others to see this goal</p>
            </div>
            <Switch onChange={(e) => setValue((prev) => ({ ...prev, isPublic: e.valueOf() }))} value={value.isPublic} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddGoalPopup;
