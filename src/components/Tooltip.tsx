import { ReactNode } from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
    children: ReactNode;
    message: string | ReactNode;
    side: "top" | "bottom" | "left" | "right";
}

export default function Tooltip({ children, message, side }: Props) {
    return (
        <TooltipPrimitive.Provider>
            <TooltipPrimitive.Root>
                <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
                <AnimatePresence>
                    <TooltipPrimitive.Portal>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2, ease: "linear" }}>
                            <TooltipPrimitive.Content className="rounded-md bg-zinc-900 px-2 py-1 text-white shadow-lg" sideOffset={5} side={side}>
                                {message}
                            </TooltipPrimitive.Content>
                        </motion.div>
                    </TooltipPrimitive.Portal>
                </AnimatePresence>
            </TooltipPrimitive.Root>
        </TooltipPrimitive.Provider>
    );
}
