import { ReactNode, useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { AnimatePresence, motion, MotionProps } from "framer-motion";

interface Props {
    trigger: ReactNode;
    labels: ReactNode[];
    className?: string | undefined;
    triggerClassName?: string;
}

const animations: MotionProps = {
    initial: "in",
    exit: "out",
    animate: "animate",
    variants: {
        in: { scale: 0, opacity: 0 },
        animate: {
            scale: 1,
            opacity: 1,
            transition: {
                type: "spring",
                duration: 0.4,
            },
        },
        out: { scale: 0, opacity: 0 },
    },
};

export default function Select({ trigger, labels, className, triggerClassName }: Props) {
    const [open, setOpen] = useState<boolean>(true);

    const triggerAnimations: MotionProps = {
        whileTap: "tapped",
        variants: {
            tapped: { scale: 0.98, opacity: 0.8, transition: { duration: 0.1 } },
        },
    };

    const itemAnimations: MotionProps = {
        initial: "in",
        exit: "out",
        animate: "animate",
        variants: {
            in: { x: -10, opacity: 0 },
            animate: {
                x: 0,
                opacity: 1,
                transition: {
                    type: "spring",
                    duration: 0.4,
                },
            },
            out: { x: -10, opacity: 0 },
        },
    };

    return (
        <Popover.Root onOpenChange={(o) => setOpen(o)}>
            <Popover.Trigger>
                <motion.div className={triggerClassName} {...triggerAnimations}>
                    {trigger}
                </motion.div>
            </Popover.Trigger>
            <AnimatePresence>
                {open ? (
                    <Popover.Portal forceMount>
                        <Popover.Content asChild forceMount sideOffset={5}>
                            <motion.div className={className + " flex flex-col space-y-2 rounded-md shadow-lg"} {...animations}>
                                {labels.map((node, index) => {
                                    return (
                                        <motion.div key={index} {...itemAnimations}>
                                            {node}
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                        </Popover.Content>
                    </Popover.Portal>
                ) : null}
            </AnimatePresence>
        </Popover.Root>
    );
}
