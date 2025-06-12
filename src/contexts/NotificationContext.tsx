import { Button, notification } from "antd";
import React, { createContext } from "react";

type NotificationType = "success" | "info" | "warning" | "error";

type TopenNotification = {
  message: string;
  description?: string;
  type?: NotificationType;
  placement?: "topLeft" | "topRight" | "bottom" | "bottomLeft" | "bottomRight";
  pauseOnHover?: boolean;
  button?: "default" | React.ReactNode;
};

type TNotificationContext = {
  openNotification: (params: TopenNotification) => void;
};

const NotificationContext = createContext<TNotificationContext | undefined>(undefined);

const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [api, contextHolder] = notification.useNotification();
  const openNotification = ({ message, type, description, placement = "bottomRight", pauseOnHover = false, button }: TopenNotification) => {
    const key = `open${Date.now()}`;
    const defaultButton = (
      <Button type="primary" size="small" onClick={() => api.destroy(key)}>
        Confirm
      </Button>
    );
    if (type)
      api[type]({
        message,
        description,
        showProgress: true,
        placement,
        pauseOnHover,
        key,
        btn: button && (button === "default" ? defaultButton : button),
      });
    else {
      api.open({
        message,
        description,
        showProgress: true,
        placement,
        pauseOnHover,
        key,
        btn: button && (button === "default" ? defaultButton : button),
      });
    }
  };

  return (
    <NotificationContext.Provider value={{ openNotification }}>
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  );
};

export {NotificationContext, NotificationProvider}