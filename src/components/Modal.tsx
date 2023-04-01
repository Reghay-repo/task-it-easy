import { ReactNode, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
    trigger: ReactNode;
    title: string | ReactNode;
    className: string;
    children: ReactNode;
    onTrigger?: () => void;
    triggerClassName?: string;
    defaultOpen?: boolean;
    onOpenChange?: () => void;
}

export default function Modal({ trigger, className, title, children, onTrigger, triggerClassName, defaultOpen, onOpenChange }: Props) {
    const [open, setOpen] = useState<boolean>(defaultOpen ?? false);

    return (
        <Dialog.Root
            defaultOpen={defaultOpen ?? false}
            modal={true}
            onOpenChange={(o) => {
                if (onOpenChange) {
                    onOpenChange();
                }
                setOpen(o);
            }}
        >
            <Dialog.Trigger
                className={triggerClassName}
                onClick={() => {
                    if (onTrigger) {
                        onTrigger();
                    }
                }}
            >
                {trigger}
            </Dialog.Trigger>
            <AnimatePresence>
                {open ? (
                    <Dialog.Portal forceMount>
                        <Dialog.Overlay asChild forceMount className="overflow-y-auto">
                            <motion.div className="fixed inset-0 z-[150] bg-black" initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} transition={{ duration: 0.2, ease: "easeInOut" }}></motion.div>
                        </Dialog.Overlay>
                        <Dialog.Content asChild forceMount className={"fixed inset-0 z-[200] m-auto h-[90vh] w-[90vw] rounded-lg bg-skin-base shadow-lg focus:outline-none " + className}>
                            <motion.div className="flex h-full w-full flex-col" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }}>
                                <Dialog.Title className="border-b border-skin-base p-2 text-lg font-semibold text-skin-base">{title}</Dialog.Title>
                                <motion.div className="min-h-0 w-full flex-grow overflow-y-auto" initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }}>
                                    {children}
                                </motion.div>
                                <Dialog.Close asChild className="absolute top-2 right-2 bg-skin-base">
                                    <button type="button" className="x-button flex-none">
                                        &#10005;
                                    </button>
                                </Dialog.Close>
                            </motion.div>
                        </Dialog.Content>
                    </Dialog.Portal>
                ) : null}
            </AnimatePresence>
        </Dialog.Root>
    );
}
