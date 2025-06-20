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
  undo?: { f: (taskId: string) => void; id: string };
};

type TNotificationContext = {
  openNotification: (params: TopenNotification) => void;
};

const NotificationContext = createContext<TNotificationContext | undefined>(undefined);

const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [api, contextHolder] = notification.useNotification();
  const openNotification = ({ message, type, description, placement = "bottomRight", pauseOnHover = false, button, undo }: TopenNotification) => {
    const key = `open${Date.now()}`;
    const defaultButton = (
      <Button type="primary" size="small" onClick={() => api.destroy(key)}>
        Confirm
      </Button>
    );
    const undoButton = (
      <Button
        type="primary"
        size="small"
        onClick={() => {
          api.destroy(key);
          if (undo) undo.f(undo.id);
        }}
      >
        Undo
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
        btn: button ? (button === "default" ? defaultButton : button) : undo && undoButton,
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

export { NotificationContext, NotificationProvider };
