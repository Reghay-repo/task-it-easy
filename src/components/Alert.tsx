import { ReactNode, useState } from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import ExclamationIcon from "@heroicons/react/24/outline/ExclamationCircleIcon";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
    trigger: ReactNode;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function Alert({ trigger, title, message, onConfirm, onCancel, confirmText, cancelText }: Props) {
    const [open, setOpen] = useState<boolean>(false);
    return (
        <AlertDialog.Root
            onOpenChange={(o) => {
                setOpen(o);
            }}
        >
            <AlertDialog.Trigger asChild>{trigger}</AlertDialog.Trigger>
            <AnimatePresence>
                {open ? (
                    <AlertDialog.Portal>
                        <AlertDialog.Overlay asChild forceMount className="overflow-y-auto">
                            <motion.div className="fixed inset-0 z-[150] bg-black" initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} transition={{ duration: 0.2, ease: "easeInOut" }}></motion.div>
                        </AlertDialog.Overlay>
                        <AlertDialog.Content className="fixed inset-0 z-[200] m-auto flex h-40 w-[90vw] max-w-[500px] flex-col rounded-lg bg-skin-base p-4 shadow-lg focus:outline-none">
                            <motion.div className="min-h-0 flex-grow" initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }}>
                                <AlertDialog.Title className="flex flex-row items-center space-x-2 text-lg font-semibold text-red-600">
                                    <div className="flex items-center justify-start rounded-full bg-red-100 p-1">
                                        <ExclamationIcon className="h-6 w-6"></ExclamationIcon>
                                    </div>
                                    <span className="text-skin-base">{title}</span>
                                </AlertDialog.Title>
                                <AlertDialog.Description className="mt-2 text-skin-base">{message}</AlertDialog.Description>
                            </motion.div>
                            <motion.div className="mt-4 flex flex-none flex-row justify-end space-x-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }}>
                                <AlertDialog.Cancel asChild>
                                    <button type="button" onClick={() => onCancel()} className="button secondary">
                                        {cancelText ?? "Cancel"}
                                    </button>
                                </AlertDialog.Cancel>
                                <AlertDialog.Action asChild>
                                    <button type="button" onClick={() => onConfirm()} className="button danger">
                                        {confirmText ?? "Ok"}
                                    </button>
                                </AlertDialog.Action>
                            </motion.div>
                        </AlertDialog.Content>
                    </AlertDialog.Portal>
                ) : null}
            </AnimatePresence>
        </AlertDialog.Root>
    );
}
