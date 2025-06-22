import { Button, notification, Space } from "antd";
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
  const [api, contextHolder] = notification.useNotification({ stack: { threshold: 2 } });
  const openNotification = ({ message, type, description, placement = "bottomRight", pauseOnHover = false, button, undo }: TopenNotification) => {
    const key = `open${Date.now()}`;
    const defaultButton = (
      <Button type="primary" size="small" onClick={() => api.destroy(key)}>
        Confirm
      </Button>
    );
    const undoButton = (
      <Space>
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
        {defaultButton}
      </Space>
    );
    const apiItems = {
      message,
      description,
      showProgress: true,
      placement,
      pauseOnHover,
      key,
      btn: button ? (button === "default" ? defaultButton : button) : undo && undoButton,
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
