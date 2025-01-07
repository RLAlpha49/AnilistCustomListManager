"use client";

import Layout from "@/components/layout";
import ToastContainer from "@/components/ui/toast-container";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { FaArrowsAlt, FaSort, FaSyncAlt } from "react-icons/fa";
import Breadcrumbs from "@/components/breadcrumbs";
import { useToast } from "@/hooks/use-toast";
import { Trans } from "@lingui/react";
import LoadingIndicator from "@/components/loading-indicator";
import { Suspense } from "react";

function PageData() {
	const { toast } = useToast();

	const clearCache = () => {
		localStorage.clear();
		toast({
			title: <Trans id="title.cache_cleared" message="Cache cleared!" />,
			description: (
				<Trans
					id="description.cache_cleared_description"
					message="Your cache has been cleared."
				/>
			),
			variant: "success",
		});
	};

	const breadcrumbs = [{ name: "Home", href: "/" }];

	return (
		<Layout>
			<Breadcrumbs breadcrumbs={breadcrumbs} />
			<div className="flex flex-col items-center justify-center bg-gray-900 text-gray-100 px-4">
				{/* Hero Section */}
				<div className="w-full max-w-4xl bg-gray-800 rounded-lg shadow-lg p-8 mb-12">
					<CardHeader>
						<CardTitle className="text-4xl font-bold text-white">
							<Trans
								id="title.anilist_custom_list_manager"
								message="Anilist Custom List Manager"
							/>
						</CardTitle>
						<CardDescription className="text-gray-300 mt-2">
							<Trans
								id="description.manage_lists"
								message="Manage your anime and manga lists with ease"
							/>
						</CardDescription>
					</CardHeader>
					<CardContent>
						<p className="mb-6 text-gray-200">
							<Trans
								id="description.hero_paragraph"
								message="Take full control of your Anilist experience by organizing your entries into customized lists. Whether you're tracking anime, manga, or both, our tool offers advanced features to suit your needs."
							/>
						</p>
						<div className="flex space-x-4">
							<Button
								asChild
								className="bg-blue-600 hover:bg-blue-700 text-white"
								aria-label={
									(
										<Trans
											id="aria.get_started"
											message="Get Started with Anilist"
										/>
									) as unknown as string
								}
							>
								<Link href="/anilist-login">
									<Trans id="button.get_started" message="Get Started" />
								</Link>
							</Button>
							<Button
								variant="outline"
								asChild
								className="text-black hover:text-white border-gray-600 hover:bg-gray-700 transition-colors"
								aria-label={
									(
										<Trans
											id="aria.faq"
											message="Frequently Asked Questions about Anilist Custom List Manager"
										/>
									) as unknown as string
								}
							>
								<Link href="/faq">
									<Trans id="button.faq" message="FAQ" />
								</Link>
							</Button>
						</div>
					</CardContent>
				</div>

				{/* Features Section */}
				<div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
					<div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
						<div className="mb-4">
							<FaArrowsAlt
								className="w-12 h-12 mx-auto text-blue-400"
								aria-hidden="true"
							/>
						</div>
						<h3 className="text-xl font-semibold mb-2">
							<Trans id="feature.move_entries" message="Move Your Entries" />
						</h3>
						<p className="text-gray-300">
							<Trans
								id="feature.move_entries_description"
								message="Effortlessly move your entries to specific custom lists, keeping your Anilist organized according to your preferences."
							/>
						</p>
					</div>
					<div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
						<div className="mb-4">
							<FaSort
								className="w-12 h-12 mx-auto text-blue-400"
								aria-hidden="true"
							/>
						</div>
						<h3 className="text-xl font-semibold mb-2">
							<Trans id="feature.sort_entries" message="Sort Entries" />
						</h3>
						<p className="text-gray-300">
							<Trans
								id="feature.sort_entries_description"
								message="Sort your entries based on status, score, rereads, genres, tags, and type to quickly find what you're looking for."
							/>
						</p>
					</div>
					<div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
						<div className="mb-4">
							<FaSyncAlt
								className="w-12 h-12 mx-auto text-blue-400"
								aria-hidden="true"
							/>
						</div>
						<h3 className="text-xl font-semibold mb-2">
							<Trans id="feature.update_entries" message="Update Entries" />
						</h3>
						<p className="text-gray-300">
							<Trans
								id="feature.update_entries_description"
								message="Automatically update entries based on the conditions you set, ensuring your lists are always up-to-date."
							/>
						</p>
					</div>
				</div>

				{/* Clear Cache Button */}
				<div className="mb-12">
					<Button
						onClick={clearCache}
						className="bg-red-600 hover:bg-red-700 text-white"
						aria-label={
							(
								<Trans id="aria.clear_cache" message="Clear Cache" />
							) as unknown as string
						}
					>
						<Trans id="button.clear_cache" message="Clear Cache" />
					</Button>
				</div>
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
