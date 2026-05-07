"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type AlertType = "success" | "error" | "info";

export interface AlertMessage {
  id: string;
  text: string;
  type: AlertType;
  duration?: number;
}

interface AlertContextValue {
  showAlert: (text: string, type?: AlertType, duration?: number) => void;
  alerts: AlertMessage[];
  removeAlert: (id: string) => void;
}

const AlertContext = createContext<AlertContextValue | undefined>(undefined);

export function AlertProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<AlertMessage[]>([]);

  const removeAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const showAlert = useCallback(
    (text: string, type: AlertType = "info", duration = 3000) => {
      const id = Date.now() + "-" + Math.random().toString(36).substring(2, 9);
      const newAlert: AlertMessage = { id, text, type, duration };
      setAlerts((prev) => [...prev, newAlert]);

      if (duration > 0) {
        setTimeout(() => removeAlert(id), duration);
      }
    },
    [removeAlert]
  );

  return (
    <AlertContext.Provider value={{ showAlert, alerts, removeAlert }}>
      {children}
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert deve ser usado dentro de AlertProvider");
  }
  return context;
}