import React, { useEffect, ReactNode } from "react";

interface CustomToastProps {
	title: ReactNode;
	description: ReactNode;
	onClose: () => void;
	variant?: "default" | "destructive" | "info" | "warning" | "error" | "success";
}

const variantStyles: Record<string, string> = {
	default: "bg-gray-600",
	destructive: "bg-red-700",
	info: "bg-blue-600",
	warning: "bg-yellow-500",
	error: "bg-red-600",
	success: "bg-green-600",
};

const autoDismissDurations: Record<string, number> = {
	default: 3000, // 3 seconds
	destructive: 5000, // 5 seconds
	info: 3000, // 3 seconds
	warning: 5000, // 5 seconds
	error: 10000, // 10 seconds
	success: 1000, // 1 second
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
			className={`w-80 p-4 rounded shadow-lg flex justify-between items-start ${variantStyles[variant]} text-white`}
		>
			<div>
				<strong className="block text-lg">{title}</strong>
				<p className="mt-1 text-sm">{description}</p>
			</div>
			<button onClick={onClose} className="ml-4 font-bold">
				×
			</button>
		</div>
	);
};

export default CustomToast;
