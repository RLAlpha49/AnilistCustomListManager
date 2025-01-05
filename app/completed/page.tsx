"use client";

import Layout from '@/components/layout'
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaCheckCircle, FaHome, FaList, FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import ToastContainer from '@/components/ui/toast-container';
import { toast } from '@/hooks/use-toast';

interface Summary {
	totalListsUpdated: number;
	totalEntriesUpdated: number;
}

interface CompletedPageProps {
	summary?: Summary;
}

export default function CompletedPage({ summary }: CompletedPageProps): JSX.Element {
	const router = useRouter();
	const [localSummary, setLocalSummary] = useState<Summary>({
		totalListsUpdated: 0,
		totalEntriesUpdated: 0,
	});

	useEffect(() => {
		const storedSummary = localStorage.getItem("updateSummary");
		let summaryData: Summary = { totalListsUpdated: 0, totalEntriesUpdated: 0 };

		if (storedSummary) {
			summaryData = JSON.parse(storedSummary);
			localStorage.removeItem("updateSummary");
		} else if (summary) {
			summaryData = summary;
		} else {
			toast({
				title: "No Update Information",
				description: "No summary data was found for your recent update.",
				variant: "warning",
			});
		}

		setLocalSummary(summaryData);
	}, [summary]);

	const handleGoHome = () => {
		router.push("/");
	};

	const handleManageLists = () => {
		router.push("/custom-list-manager");
	};

	return (
		<Layout>
			<div className="flex items-center justify-center bg-gray-900 text-gray-100 px-4">
				<Card className="w-full max-w-lg bg-gray-800 shadow-xl rounded-lg overflow-hidden">
					<CardHeader className="text-center">
						<motion.div
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							transition={{ duration: 0.5 }}
							className="flex justify-center"
						>
							<FaCheckCircle className="text-green-500 w-16 h-16" />
						</motion.div>
						<CardTitle className="mt-4 text-3xl font-bold text-white">Update Completed!</CardTitle>
						<CardDescription className="mt-2 text-gray-300">
							Your custom lists have been successfully updated.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.3, duration: 0.5 }}
							className="mt-4 space-y-2"
						>
							{localSummary.totalListsUpdated === 0 && localSummary.totalEntriesUpdated === 0 ? (
								<div className="text-yellow-400 text-center">
									<p>No update information was found for your recent update.</p>
								</div>
							) : (
								<>
									<div className="flex justify-between">
										<span className="text-white">Total Lists:</span>
										<span className="font-semibold text-white">{localSummary.totalListsUpdated}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-white">Total Entries Updated:</span>
										<span className="font-semibold text-white">
											{localSummary.totalEntriesUpdated}
										</span>
									</div>
								</>
							)}
						</motion.div>
						<div className="mt-6 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
							<motion.div
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								className="w-full sm:w-auto"
							>
								<Button
									onClick={handleManageLists}
									className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
									aria-label="Manage Lists Again"
								>
									<FaList className="mr-2" />
									Manage Lists
								</Button>
							</motion.div>
							<motion.div
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								className="w-full sm:w-auto"
							>
								<Button
									onClick={handleGoHome}
									variant="outline"
									className="text-black hover:text-white border-gray-600 hover:bg-gray-700 transition-colors flex items-center"
									aria-label="Go to Home"
								>
									<FaHome className="mr-2" />
									Home
								</Button>
							</motion.div>
						</div>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.6, duration: 0.5 }}
							className="mt-8 text-center"
						>
							<h2 className="text-2xl font-semibold text-white mb-4">Check Out My Other Projects</h2>
							<div className="flex flex-wrap justify-center items-center space-x-2 space-y-2 overflow-auto max-h-40">
								<motion.a
									href="https://github.com/RLAlpha49/AniCards"
									target="_blank"
									rel="noopener noreferrer"
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									className="w-full sm:w-auto mt-2 ml-2"
								>
									<Button className="flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white">
										<FaGithub className="mr-2" />
										AniCards
									</Button>
								</motion.a>
								<motion.a
									href="https://github.com/RLAlpha49/AniSearchModel"
									target="_blank"
									rel="noopener noreferrer"
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									className="w-full sm:w-auto"
								>
									<Button className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white">
										<FaGithub className="mr-2" />
										AniSearchModel
									</Button>
								</motion.a>
								<motion.a
									href="https://github.com/RLAlpha49/AniSearch"
									target="_blank"
									rel="noopener noreferrer"
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									className="w-full sm:w-auto"
								>
									<Button className="flex items-center justify-center bg-yellow-600 hover:bg-yellow-700 text-white">
										<FaGithub className="mr-2" />
										AniSearch
									</Button>
								</motion.a>
								<motion.a
									href="https://github.com/RLAlpha49/SpotifySkipTracker"
									target="_blank"
									rel="noopener noreferrer"
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									className="w-full sm:w-auto"
								>
									<Button className="flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white">
										<FaGithub className="mr-2" />
										SpotifySkipTracker
									</Button>
								</motion.a>
								<motion.a
									href="https://github.com/RLAlpha49/Anilist-Manga-Updater"
									target="_blank"
									rel="noopener noreferrer"
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									className="w-full sm:w-auto"
								>
									<Button className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white">
										<FaGithub className="mr-2" />
										Anilist-Manga-Updater
									</Button>
								</motion.a>
							</div>
						</motion.div>
					</CardContent>
				</Card>
			</div>
			<ToastContainer />
		</Layout>
	);
}
