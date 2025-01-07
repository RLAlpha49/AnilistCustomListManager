import React from "react";
import LoadingIndicator from "@/components/loading-indicator";

const LoadingFallback: React.FC = () => {
	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-100">
			<LoadingIndicator />
		</div>
	);
};

export default LoadingFallback;
