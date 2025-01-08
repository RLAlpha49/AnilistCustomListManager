import React, { useEffect, ReactNode } from "react";

interface CustomToastProps {
	title: ReactNode;
	description: ReactNode;
	onClose: () => void;
	variant?: "default" | "destructive" | "info" | "warning" | "error" | "success";
}

const variantStyles: Record<string, string> = {
	default: "bg-gray-200 dark:bg-gray-600",
	destructive: "bg-red-200 dark:bg-red-700",
	info: "bg-blue-200 dark:bg-blue-600",
	warning: "bg-yellow-200 dark:bg-yellow-500",
	error: "bg-red-200 dark:bg-red-600",
	success: "bg-green-200 dark:bg-green-600",
};

const textVariantStyles: Record<string, string> = {
	default: "text-gray-800 dark:text-gray-100",
	destructive: "text-red-800 dark:text-red-100",
	info: "text-blue-800 dark:text-blue-100",
	warning: "text-yellow-800 dark:text-yellow-100",
	error: "text-red-800 dark:text-red-100",
	success: "text-green-800 dark:text-green-100",
};

const autoDismissDurations: Record<string, number> = {
	default: 3000, // 3 seconds
	destructive: 5000, // 5 seconds
	info: 3000, // 3 seconds
	warning: 5000, // 5 seconds
	error: 10000, // 10 seconds
	success: 2000, // 2 seconds
};

const CustomToast: React.FC<CustomToastProps> = ({
	title,
	description,
	onClose,
	variant = "info",
}) => {
	useEffect(() => {
		const duration = autoDismissDurations[variant] || 3000;
		const timer = setTimeout(() => {
			onClose();
		}, duration);

		return () => clearTimeout(timer);
	}, [variant, onClose]);

	return (
		<div
			className={`w-80 p-4 rounded shadow-lg flex justify-between items-start ${variantStyles[variant]} ${textVariantStyles[variant]} transition-colors duration-300`}
			role="alert"
			aria-live="assertive"
		>
			<div>
				<strong className="block text-lg">{title}</strong>
				<p className="mt-1 text-sm">{description}</p>
			</div>
			<button
				onClick={onClose}
				className="ml-4 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded"
				aria-label="Close notification"
			>
				×
			</button>
		</div>
	);
};

export default CustomToast;
