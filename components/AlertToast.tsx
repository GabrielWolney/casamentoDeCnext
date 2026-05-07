"use client";

import { motion } from "framer-motion";
import { type AlertMessage } from "./AlertProvider";

export default function AlertToast({
  alert,
  onClose,
}: {
  alert: AlertMessage;
  onClose: () => void;
}) {
  const colorMap = {
    success: "border-l-[#6BC27C]",
    error: "border-l-[#E15554]",
    info: "border-l-[#7BC0E3]",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="glass-card rounded-2xl p-5 shadow-[0_12px_40px_-8px_rgba(0,0,0,0.15)] border-l-4 flex items-start gap-3 w-full bg-white/80 backdrop-blur-xl"
    >
      <div className={`w-full ${colorMap[alert.type] || colorMap.info}`}>
        <p className="font-sans text-base font-medium leading-relaxed pr-8 text-[#1a2634]">
          {alert.text}
        </p>
      </div>
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition-colors text-xl"
        aria-label="Fechar"
      >
        ✕
      </button>
    </motion.div>
  );
}