"use client";

import { AlertCircle } from "lucide-react";
import { motion } from "motion/react";

type FullScreenErrorProps = {
  title: string;
  description: string;
  action?: React.ReactNode;
};

export function FullScreenError({
  title,
  description,
  action,
}: FullScreenErrorProps) {
  return (
    <motion.div
      className="flex flex-col gap-4 items-center justify-center h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <AlertCircle className="h-10 w-10 text-muted-foreground" />
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {action}
    </motion.div>
  );
}
