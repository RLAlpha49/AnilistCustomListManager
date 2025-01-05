"use client";

import Layout from "@/components/layout";
import ToastContainer from "@/components/ui/toast-container";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { setItemWithExpiry } from "@/lib/local-storage";

export default function Page() {
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
			<Card
				className="w-full max-w-md mx-auto bg-gray-800 text-gray-100"
				role="alert"
				aria-live="polite"
			>
				<CardContent className="p-6">
					<p className="text-center text-lg">Processing login...</p>
				</CardContent>
			</Card>
			<ToastContainer />
		</Layout>
	);
}
