import React, { useState, useEffect } from "react";
import Modal from "@/components/ui/modal";
import { useToast } from "@/hooks/use-toast";

interface RenameModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentListName: string;
    onRename: (newName: string) => void;
}

const RenameModal: React.FC<RenameModalProps> = React.memo(({ isOpen, onClose, currentListName, onRename }) => {
    const [newListName, setNewListName] = useState<string>(currentListName);
    const { toast } = useToast();

    useEffect(() => {
        setNewListName(currentListName);
    }, [currentListName]);

    const handleRename = () => {
        const trimmedName = newListName.trim();
        if (trimmedName === "") {
            toast({
                title: "Error",
                description: "List name cannot be empty.",
                variant: "error",
            });
            return;
        }
        onRename(trimmedName);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={handleRename}
            title={`Rename "${currentListName}"`}
            confirmButtonText="Save"
        >
            <div className="flex flex-col space-y-4">
                <label htmlFor="newListName" className="text-gray-200">
                    New List Name:
                </label>
                <input
                    type="text"
                    id="newListName"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    className="p-2 rounded bg-gray-600 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter new list name"
                />
            </div>
        </Modal>
    );
});

RenameModal.displayName = "RenameModal";

export { RenameModal };