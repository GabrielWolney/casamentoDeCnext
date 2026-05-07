"use client";

import { AnimatePresence } from "framer-motion";
import { useAlert } from "./AlertProvider";
import AlertToast from "./AlertToast";

export default function AlertsOverlay() {
  const { alerts, removeAlert } = useAlert();

  return (
    <div className="fixed top-28 left-0 right-0 z-[99999] flex flex-col items-center gap-3 pointer-events-none">
      <AnimatePresence>
        {alerts.map((alert) => (
          <div key={alert.id} className="pointer-events-auto w-full max-w-md px-4">
            <AlertToast alert={alert} onClose={() => removeAlert(alert.id)} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}