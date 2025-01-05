"use client";

import React from "react";
import { useToast, ToastType } from "@/hooks/use-toast";
import CustomToast from "@/components/ui/custom-toast";

const ToastContainer: React.FC = () => {
	const { toasts, dismiss } = useToast();

	const allowedVariants = ["info", "warning", "error", "success", "default", "destructive"] as const;
	type AllowedVariant = typeof allowedVariants[number];

	return (
		<div className="fixed bottom-4 right-4 flex flex-col space-y-2 z-50">
			{toasts.map((toast: ToastType) => {
				const variant: AllowedVariant = allowedVariants.includes(toast.variant as AllowedVariant)
					? (toast.variant as AllowedVariant)
					: "info";

				return (
					<CustomToast
						key={toast.id}
						title={toast.title || ""}
						description={toast.description || ""}
						onClose={() => dismiss(toast.id)}
						variant={variant}
					/>
				);
			})}
		</div>
	);
};

export default ToastContainer;
