"use client";

import Layout from "@/components/layout";
import ToastContainer from "@/components/ui/toast-container";
import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { setItemWithExpiry } from "@/lib/local-storage";
import { Trans } from "@lingui/react";
import LoadingIndicator from "@/components/loading-indicator";

function PageData() {
	const router = useRouter();

	useEffect(() => {
		try {
			const urlHash: string = new URL(window.location.href).hash;
			const params: URLSearchParams = new URLSearchParams(urlHash.substring(1));
			const accessToken: string | null = params.get("access_token");

			if (accessToken) {
				saveToken(accessToken);
				router.push("/anilist-login");
			} else {
				console.error("No access token found in URL hash");
			}
		} catch (error) {
			console.error("Failed to process redirect:", error);
		}
	}, [router]);

	const saveToken = (accessToken: string): void => {
		try {
			setItemWithExpiry("anilistToken", accessToken, 60 * 60 * 24 * 7 * 1000);
		} catch (error) {
			console.error("Failed to save token:", error);
		}
	};

	return (
		<Layout>
			<div className="flex items-center justify-center px-4 py-12 bg-gray-100 dark:bg-gray-900">
				<Card
					className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-2xl rounded-lg transition-colors duration-300"
					role="alert"
					aria-live="polite"
				>
					<CardContent className="p-6">
						<p className="text-center text-lg">
							<Trans id="status.processing_login" message="Processing login..." />
						</p>
					</CardContent>
				</Card>
			</div>
			<ToastContainer />
		</Layout>
	);
}

export default function Page() {
	return (
		<Suspense fallback={<LoadingIndicator />}>
			<PageData />
		</Suspense>
	);
}
