import { AnimatePresence, motion, MotionProps } from "framer-motion";
import { Dispatch, ReactNode, SetStateAction, useState } from "react";
import * as Popover from "@radix-ui/react-popover";

interface Props {
    children: ReactNode;
    trigger: ReactNode;
    className: string;
    triggerClassName?: string;
    exposedOpen?: boolean;
    setExposedOpen?: Dispatch<SetStateAction<boolean>>;
    defaultOpen?: boolean;
}

const triggerAnimations: MotionProps = {
    whileTap: "tapped",
    variants: {
        tapped: { scale: 0.98, opacity: 0.8, transition: { duration: 0.1 } },
    },
};

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

export default function PopOver({ children, trigger, className, exposedOpen, setExposedOpen, defaultOpen, triggerClassName }: Props) {
    const [open, setOpen] = exposedOpen != undefined && setExposedOpen != undefined ? [exposedOpen, setExposedOpen] : useState<boolean>(false);

    return (
        <Popover.Root open={open} onOpenChange={(o) => setOpen(o)} defaultOpen={defaultOpen ?? false} modal={true}>
            <Popover.Trigger className="focus:outline-none">
                <motion.div className={"focus:outline-none " + triggerClassName} {...triggerAnimations}>
                    {trigger}
                </motion.div>
            </Popover.Trigger>
            <AnimatePresence>
                {open ? (
                    <Popover.Portal forceMount>
                        <Popover.Content asChild forceMount sideOffset={10}>
                            <motion.div className={className + " flex flex-col space-y-2 rounded-md shadow-lg"} {...animations}>
                                {children}
                            </motion.div>
                        </Popover.Content>
                    </Popover.Portal>
                ) : null}
            </AnimatePresence>
        </Popover.Root>
    );
}
