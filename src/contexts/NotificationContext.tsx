/* eslint-disable @typescript-eslint/no-explicit-any */
import { capitalWord } from "@/utils/stringManip";
import { Button, notification, Space } from "antd";
import React, { createContext } from "react";

type NotificationType = "success" | "info" | "warning" | "error";

export type NotificationFunction<T extends any[]> = {
  f: (...args: T) => void | Promise<void>;
  label: string;
  params?: T;
};

type TopenNotification<T extends any[] = any[]> = {
  message: string;
  description?: string;
  type?: NotificationType;
  placement?: "topLeft" | "topRight" | "bottom" | "bottomLeft" | "bottomRight";
  pauseOnHover?: boolean;
  button?: "default" | React.ReactNode;
  buttonFunc?: NotificationFunction<T>;
};

type TNotificationContext = {
  openNotification: <T extends any[]>(params: TopenNotification<T>) => void;
};

const NotificationContext = createContext<TNotificationContext | undefined>(undefined);

const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [api, contextHolder] = notification.useNotification({ stack: { threshold: 2 } });
  const openNotification = ({
    message,
    type,
    description,
    placement = "bottomRight",
    pauseOnHover = false,
    button,
    buttonFunc,
  }: TopenNotification) => {
    const key = `open${Date.now()}`;
    const defaultButton = (
      <Button type="primary" size="small" onClick={() => api.destroy(key)}>
        Confirm
      </Button>
    );
    const buttonFuncComp = (
      <Space>
        <Button
          type="primary"
          size="small"
          onClick={() => {
            api.destroy(key);
            if (buttonFunc)
              if (buttonFunc.params) buttonFunc.f(...buttonFunc.params);
              else buttonFunc.f();
          }}
        >
          {buttonFunc?.label}
        </Button>
        {defaultButton}
      </Space>
    );
    const apiItems = {
      message: capitalWord(message),
      description,
      showProgress: true,
      placement,
      pauseOnHover,
      key,
      btn: button ? (button === "default" ? defaultButton : button) : buttonFunc && buttonFuncComp,
    };

    if (type) api[type](apiItems);
    else {
      api.open(apiItems);
    }
  };

  return (
    <NotificationContext.Provider value={{ openNotification }}>
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  );
};

export { NotificationContext, NotificationProvider };
