import React, { useState, useEffect } from "react";
import Modal from "@/components/ui/modal";
import { useToast } from "@/hooks/use-toast";
import { Trans } from "@lingui/react";

interface RenameModalProps {
	isOpen: boolean;
	onClose: () => void;
	currentListName: string;
	onRename: (newName: string) => void;
}

const RenameModal: React.FC<RenameModalProps> = React.memo(
	({ isOpen, onClose, currentListName, onRename }) => {
		const [newListName, setNewListName] = useState<string>(currentListName);
		const { toast } = useToast();

		useEffect(() => {
			setNewListName(currentListName);
		}, [currentListName]);

		const handleRename = () => {
			const trimmedName = newListName.trim();
			if (trimmedName === "") {
				toast({
					title: <Trans id="toast.error_title" message="Error" />,
					description: (
						<Trans
							id="toast.error_description_empty_list_name"
							message="List name cannot be empty."
						/>
					),
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
				confirmButtonText={<Trans id="button.save" message="Save" /> as unknown as string}
			>
				<div className="flex flex-col space-y-4">
					<label htmlFor="newListName" className="text-gray-200">
						<Trans id="label.new_list_name" message="New List Name:" />
					</label>
					<input
						type="text"
						id="newListName"
						value={newListName}
						onChange={(e) => setNewListName(e.target.value)}
						className="p-2 rounded bg-gray-600 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder={
							<Trans
								id="placeholder.enter_new_list_name"
								message="Enter new list name"
							/> as unknown as string
						}
						aria-label={<Trans id="aria.new_list_name" message="New list name" /> as unknown as string}
					/>
				</div>
			</Modal>
		);
	}
);

RenameModal.displayName = "RenameModal";

export { RenameModal };
