import React, { useEffect } from "react";
import { FaTimes } from "react-icons/fa";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title: string;
	confirmButtonText?: string;
	children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onConfirm, title, confirmButtonText = "Confirm", children }) => {
	useEffect(() => {
		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				onClose();
			}
		};
		if (isOpen) {
			document.addEventListener("keydown", handleEscape);
		}
		return () => {
			document.removeEventListener("keydown", handleEscape);
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300"
			aria-modal="true"
			role="dialog"
			aria-labelledby="modal-title"
			aria-describedby="modal-description"
		>
			<div className="bg-gray-800 text-gray-100 rounded-lg shadow-2xl w-11/12 max-w-md mx-auto p-6 relative animate-fade-in-up">
				{/* Close Button */}
				<button
					onClick={onClose}
					className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 focus:outline-none"
					aria-label="Close Modal"
				>
					<FaTimes size={20} />
				</button>
				{/* Modal Title */}
				<h2 id="modal-title" className="text-2xl font-bold mb-4">
					{title}
				</h2>
				{/* Modal Content */}
				<div id="modal-description" className="max-h-80 overflow-y-auto">
					{children}
				</div>
				{/* Action Buttons */}
				<div className="flex justify-end space-x-4 mt-6">
					<button
						onClick={onClose}
						className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded focus:outline-none"
					>
						Cancel
					</button>
					<button
						onClick={() => {
							onConfirm();
							onClose();
						}}
						className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded focus:outline-none"
					>
						{confirmButtonText}
					</button>
				</div>
			</div>
		</div>
	);
};

export default Modal;
