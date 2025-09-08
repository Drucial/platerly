import { Loader2 } from "lucide-react";
import { motion } from "motion/react";

type FullScreenLoaderProps = {
  title?: string;
  description?: string;
};

export function FullScreenLoader({
  title,
  description,
}: FullScreenLoaderProps) {
  return (
    <motion.div
      className="flex flex-col gap-4 items-center justify-center h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </motion.div>
  );
}
