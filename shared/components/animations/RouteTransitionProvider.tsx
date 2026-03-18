"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "@/i18n/routing";

export default function RouteTransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={reduceMotion ? { opacity: 1 } : { opacity: 0.76 }}
        animate={{ opacity: 1 }}
        exit={reduceMotion ? { opacity: 1 } : { opacity: 0.94 }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: 0.16, ease: [0.22, 1, 0.36, 1] }
        }
        className="min-h-full"
        style={{ willChange: reduceMotion ? undefined : "opacity" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
