"use client";

import Layout from "@/components/layout";
import ToastContainer from "@/components/ui/toast-container";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import MediaCard from "@/components/media-card";
import LoadingIndicator from "@/components/loading-indicator";
import { fetchAniList } from "@/lib/api";
import { getItemWithExpiry, setItemWithExpiry } from "@/lib/local-storage";
import { FaPlay, FaPause, FaCheckCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Breadcrumbs from "@/components/breadcrumbs";

interface Tag {
	name: string;
	category: string;
}

interface Media {
	id: number;
	title: {
		romaji: string;
		english: string;
	};
	coverImage: {
		extraLarge: string;
	};
	format: string;
	countryOfOrigin: string;
	isAdult: boolean;
	genres: string[];
	tags: Tag[];
}

interface MediaEntry {
	id: string;
	media: Media;
	status: string;
	score: number;
	repeat: number;
	customLists: Record<string, boolean>;
	hiddenFromStatusLists: boolean;
	lists: Record<string, boolean>;
	tagCategories?: string[];
	tags?: string[];
	genres?: string[];
	isAdult?: boolean;
	removing?: boolean;
}

interface MediaListResponse {
	data: {
		MediaListCollection: {
			lists: {
				entries: MediaEntry[];
			}[];
		};
	};
}

interface MutationResponse {
	data: {
		SaveMediaListEntry: {
			id: string;
			hiddenFromStatusLists: boolean;
			customLists: Record<string, boolean>;
		};
	};
}

export default function Page() {
	const [mediaList, setMediaList] = useState<MediaEntry[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [updating, setUpdating] = useState<boolean>(false);
	const [currentEntry, setCurrentEntry] = useState<MediaEntry | null>(null);
	const [totalEntries, setTotalEntries] = useState<number>(0);
	const [done, setDone] = useState<boolean>(false);
	const [retryCountdown, setRetryCountdown] = useState<number>(-1);
	const [showNotice, setShowNotice] = useState<boolean>(true);
	const { toast } = useToast();
	const router = useRouter();

	const [listType, setListType] = useState<"ANIME" | "MANGA">("ANIME");
	const [userId, setUserId] = useState<string | null>(null);
	const [lists, setLists] = useState<Array<{ name: string; selectedOption: string }>>([]);
	const [hideDefaultStatusLists, setHideDefaultStatusLists] = useState<boolean>(true);
	const [token, setToken] = useState<string | null>(null);
	const shouldPauseRef = useRef<boolean>(false);
	const updateProcessRef = useRef<Promise<void> | null>(null);
	const [updatedEntries, setUpdatedEntries] = useState<Set<number>>(new Set());
	const isPausedRef = useRef<boolean>(false);
	const [page, setPage] = useState<number>(1);
	const [isRateLimited, setIsRateLimited] = useState<boolean>(false);
	const itemsPerPage = 10;

	useEffect(() => {
		setUserId(getItemWithExpiry("userId"));
		setListType(getItemWithExpiry("listType") === "MANGA" ? "MANGA" : "ANIME");
		setLists(JSON.parse(getItemWithExpiry("lists") || "[]"));
		setHideDefaultStatusLists(
			JSON.parse(getItemWithExpiry("hideDefaultStatusLists") || "true")
		);
		setToken(getItemWithExpiry("anilistToken"));
	}, []);

	const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

	const getMediaUrl = useCallback(
		(entry: MediaEntry): string => {
			const base = "https://anilist.co/";
			const type = listType === "ANIME" ? "anime" : "manga";
			return `${base}${type}/${entry.media.id}`;
		},
		[listType]
	);

	const capitalizeWords = useCallback((str: string): string => {
		let words = str.split(/[\s()]+/);
		words = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());

		const index = words.findIndex((word) => word === "Manga");

		if (index >= 0 && index < words.length - 1) {
			words[index] = `${words[index]} (${words
				.slice(index + 1)
				.join(" ")
				.trim()})`;
			words = words.slice(0, index + 1);
		}

		return words.join(" ");
	}, []);

	const mediaListQuery = `
		query ($userId: Int, $type: MediaType) {
			MediaListCollection(userId: $userId, type: $type) {
			lists {
				entries {
				id
				hiddenFromStatusLists
				score(format: POINT_10)
				repeat
				status
				customLists
				media {
					id
					format
					countryOfOrigin
					title {
					romaji
					english
					}
					genres
					tags {
					name
					category
					}
					isAdult
					coverImage {
					extraLarge
					}
				}
				}
			}
			}
		}
		`;

	const fetchMediaList = useCallback(async () => {
		if (!userId && getItemWithExpiry("userId") === null) {
			toast({
				title: "Error",
				description: "User ID is not available",
				variant: "error",
			});
			return;
		}

		setLoading(true);
		try {
			if (userId) {
				const variables = { userId: parseInt(userId, 10), type: listType };
				const response: MediaListResponse = await fetchAniList(
					mediaListQuery,
					variables,
					token!,
					(retryAttempt: number) => {
						setRetryCountdown(60);
						isPausedRef.current = true;
						const countdownInterval = setInterval(() => {
							setRetryCountdown((prev) => {
								if (prev <= 1) {
									clearInterval(countdownInterval);
									isPausedRef.current = false;
									return -1;
								}
								return prev - 1;
							});
						}, 1000);
					},
					(error: Error) => {
						toast({
							title: "Error",
							description: `Failed to fetch media list: ${error.message}`,
							variant: "error",
						});
					}
				);
				const mediaLists = response.data.MediaListCollection.lists;
				let entries: MediaEntry[] = mediaLists.flatMap((list) => list.entries);

				const seen = new Set<number>();
				entries = entries.filter((entry) => {
					const duplicate = seen.has(entry.media.id);
					seen.add(entry.media.id);
					return !duplicate;
				});

				entries = entries.map((entry) => {
					entry.lists = {};
					entry.tagCategories = entry.media.tags.map((tag) => tag.category);
					entry.tags = entry.media.tags.map((tag) => tag.name);
					entry.genres = entry.media.genres;
					entry.isAdult = entry.media.isAdult;

					lists.forEach((list) => {
						if (!list.selectedOption) return;

						if (list.selectedOption.includes("Status set to")) {
							let status = list.selectedOption.split(" ").slice(-1)[0].toUpperCase();
							if (status === "WATCHING" || status === "READING") {
								status = "CURRENT";
							}
							if (entry.status === status && entry.customLists[list.name] !== true) {
								entry.lists[list.name] = true;
							} else if (
								entry.status !== status &&
								entry.customLists[list.name] !== false
							) {
								entry.lists[list.name] = false;
							}
						}

						if (list.selectedOption.includes("Score set to")) {
							if (
								list.selectedOption.includes("below 5") &&
								entry.score > 0 &&
								entry.score < 5 &&
								!entry.customLists[list.name]
							) {
								entry.lists[list.name] = true;
							} else if (!list.selectedOption.includes("below 5")) {
								const scoreCondition = parseInt(
									list.selectedOption.split(" ").slice(-1)[0],
									10
								);
								if (
									entry.score === scoreCondition &&
									entry.customLists[list.name] !== true
								) {
									entry.lists[list.name] = true;
								} else if (
									entry.score !== scoreCondition &&
									entry.customLists[list.name] !== false
								) {
									entry.lists[list.name] = false;
								}
							}
						}

						if (list.selectedOption.includes("Format set to")) {
							let format = list.selectedOption
								.replace("Format set to ", "")
								.toUpperCase();
							if (
								listType === "MANGA" &&
								[
									"MANGA",
									"MANWHA",
									"MANHUA",
									"MANGA (JAPAN)",
									"MANGA (SOUTH KOREAN)",
									"MANGA (CHINESE)",
								].includes(format)
							) {
								const countryMap: Record<string, string> = {
									MANGA: "Manga (Japan)",
									MANWHA: "Manga (South Korean)",
									MANHUA: "Manga (Chinese)",
								};
								const country = entry.media.countryOfOrigin;
								if (["MANGA", "MANWHA", "MANHUA"].includes(format)) {
									format = countryMap[format as keyof typeof countryMap];
								} else {
									format = capitalizeWords(format);
								}
								if (
									(country === "JP" && format === "Manga (Japan)") ||
									(country === "KR" && format === "Manga (South Korean)") ||
									(country === "CN" && format === "Manga (Chinese)")
								) {
									if (entry.customLists[list.name] === false) {
										entry.lists[list.name] = true;
									}
								} else if (entry.customLists[list.name] !== false) {
									entry.lists[list.name] = false;
								}
							} else if (
								entry.media.format === format &&
								entry.customLists[list.name] === false
							) {
								entry.lists[list.name] = true;
							} else if (
								entry.media.format !== format &&
								entry.customLists[list.name] !== false
							) {
								entry.lists[list.name] = false;
							}
						}

						if (list.selectedOption.includes("Genres contain")) {
							const genre = list.selectedOption.replace("Genres contain ", "");
							if (
								entry.genres &&
								entry.genres.includes(genre) &&
								entry.customLists[list.name] !== true
							) {
								entry.lists[list.name] = true;
							} else if (
								entry.genres &&
								!entry.genres.includes(genre) &&
								entry.customLists[list.name] !== false
							) {
								entry.lists[list.name] = false;
							}
						}

						if (list.selectedOption.includes("Tag Categories contain")) {
							const tagCategory = list.selectedOption.replace(
								"Tag Categories contain ",
								""
							);
							if (
								entry.tagCategories &&
								entry.tagCategories.includes(tagCategory) &&
								entry.customLists[list.name] !== true
							) {
								entry.lists[list.name] = true;
							} else if (
								entry.tagCategories &&
								!entry.tagCategories.includes(tagCategory) &&
								entry.customLists[list.name] !== false
							) {
								entry.lists[list.name] = false;
							}
						}

						if (list.selectedOption.includes("Tags contain")) {
							const tag = list.selectedOption.replace("Tags contain ", "");
							if (
								entry.tags &&
								entry.tags.includes(tag) &&
								entry.customLists[list.name] !== true
							) {
								entry.lists[list.name] = true;
							} else if (
								entry.tags &&
								!entry.tags.includes(tag) &&
								entry.customLists[list.name] !== false
							) {
								entry.lists[list.name] = false;
							}
						}

						if (
							(list.selectedOption === "Reread" ||
								list.selectedOption === "Rewatched") &&
							entry.repeat > 0 &&
							!entry.customLists[list.name]
						) {
							entry.lists[list.name] = true;
						} else if (
							(list.selectedOption === "Reread" ||
								list.selectedOption === "Rewatched") &&
							entry.repeat <= 0 &&
							entry.customLists[list.name]
						) {
							entry.lists[list.name] = false;
						}

						if (
							list.selectedOption === "Adult (18+)" &&
							entry.isAdult === true &&
							entry.customLists[list.name] !== true
						) {
							entry.lists[list.name] = true;
						} else if (
							list.selectedOption === "Adult (18+)" &&
							entry.isAdult === false &&
							entry.customLists[list.name] !== false
						) {
							entry.lists[list.name] = false;
						}
					});

					if (entry.hiddenFromStatusLists !== hideDefaultStatusLists) {
						entry.lists["hiddenFromStatusLists"] = hideDefaultStatusLists;
					}

					return entry;
				});

				entries = entries.filter((entry) =>
					Object.values(entry.lists).some((value) => value !== undefined)
				);
				entries.sort((a, b) => a.media.title.romaji.localeCompare(b.media.title.romaji));

				setMediaList(entries);
				setTotalEntries(entries.length);
				setLoading(false);

				if (entries.length === 0) {
					setDone(true);
					toast({
						title: "Info",
						description: "No entries to update.",
						variant: "info",
					});
				}
			}
		} catch (error: any) {
			setLoading(false);
			toast({
				title: "Error",
				description: `An unexpected error occurred: ${error.message}`,
				variant: "error",
			});
		}
	}, [
		mediaListQuery,
		listType,
		userId,
		lists,
		hideDefaultStatusLists,
		capitalizeWords,
		toast,
		token,
	]);

	const updateMediaListQuery = `
		mutation ($mediaId: Int, $hiddenFromStatusLists: Boolean, $customLists: [String]) {
			SaveMediaListEntry (mediaId: $mediaId, hiddenFromStatusLists: $hiddenFromStatusLists, customLists: $customLists) {
				id
				hiddenFromStatusLists
				customLists
			}
		}
	`;

	const updateEntry = useCallback(
		async (entry: MediaEntry): Promise<MutationResponse> => {
			const mutation = updateMediaListQuery;

			const updatedCustomLists = { ...entry.customLists, ...entry.lists };

			const customListsToUpdate = Object.entries(updatedCustomLists)
				.filter(([_, value]) => value === true)
				.map(([key, _]) => key);

			const variables = {
				mediaId: entry.media.id,
				hiddenFromStatusLists: hideDefaultStatusLists,
				customLists: customListsToUpdate,
			};

			try {
				const data: MutationResponse = await fetchAniList(
					mutation,
					variables,
					token!,
					(retryAttempt: number) => {
						setRetryCountdown(60);
						setIsRateLimited(true);
						isPausedRef.current = true;
						const countdownInterval = setInterval(() => {
							setRetryCountdown((prev) => {
								if (prev <= 1) {
									clearInterval(countdownInterval);
									isPausedRef.current = false;
									setIsRateLimited(false);
									return -1;
								}
								return prev - 1;
							});
						}, 1000);
					},
					(error: Error) => {
						toast({
							title: "Error",
							description: `Failed to update entry "${entry.media.title.romaji}": ${error.message}`,
							variant: "error",
						});
						if (error.message === "Max retries reached for rate limiting.") {
							isPausedRef.current = true;
						}
					}
				);

				return data;
			} catch (error: any) {
				if (error.message === "Max retries reached for rate limiting.") {
					toast({
						title: "Rate Limited",
						description:
							"Exceeded maximum retry attempts due to rate limiting. Update paused.",
						variant: "error",
					});
					setIsRateLimited(true);
				}
				throw error;
			}
		},
		[updateMediaListQuery, token, hideDefaultStatusLists, toast]
	);

	const removeEntryById = useCallback((id: number): void => {
		setMediaList((prevList) => prevList.filter((e) => e.media.id !== id));
	}, []);

	const handleAnimationEnd = useCallback(
		(id: number): void => {
			removeEntryById(id);
			setUpdatedEntries((prev) => new Set(prev).add(id));
		},
		[removeEntryById]
	);

	const startUpdate = useCallback(async () => {
		setUpdating(true);
		shouldPauseRef.current = false;

		const updateLoop = async () => {
			for (const entry of mediaList) {
				while (isPausedRef.current) {
					await delay(1000);
				}

				if (shouldPauseRef.current) break;

				setCurrentEntry(entry);
				try {
					await updateEntry(entry);
					setUpdatedEntries((prev) => new Set(prev).add(entry.media.id));
					await delay(1000);

					if (updatedEntries.size + 1 === totalEntries) {
						setDone(true);
						setUpdating(false);
						toast({
							title: "Success",
							description: "All entries have been updated successfully!",
							variant: "success",
						});
						break;
					}
				} catch (error) {
					console.error(`Error updating entry ${entry.media.id}:`, error);
					setUpdating(false);
					break;
				}
			}
		};

		updateProcessRef.current = updateLoop();
	}, [mediaList, updateEntry, updatedEntries.size, totalEntries, toast]);

	const toggleUpdate = useCallback(() => {
		if (updating) {
			shouldPauseRef.current = true;
			isPausedRef.current = true;
			setUpdating(false);
			toast({
				title: "Paused",
				description: "Update process has been paused.",
				variant: "default",
			});
		} else {
			if (!isRateLimited) {
				isPausedRef.current = false;
				startUpdate();
				toast({
					title: "Updating",
					description: "Update process has started.",
					variant: "default",
				});
			} else {
				toast({
					title: "Rate Limited",
					description: "Cannot start update while rate limited.",
					variant: "error",
				});
			}
		}
	}, [updating, startUpdate, isRateLimited, toast]);

	useEffect(() => {
		const token = getItemWithExpiry("anilistToken");
		if (token) {
			fetchMediaList();
		} else {
			toast({
				title: "Error",
				description: "Anilist token not found in local storage",
				variant: "error",
			});
		}
	}, [fetchMediaList, toast, token]);

	const handleFinish = () => {
		const summary = {
			totalListsUpdated: lists.length,
			totalEntriesUpdated: updatedEntries.size,
		};
		setItemWithExpiry("updateSummary", JSON.stringify(summary), 60 * 60 * 24 * 1000);
		router.push("/completed");
	};

	const breadcrumbs = [
		{ name: "Home", href: "/" },
		{ name: "Custom List Manager", href: "/custom-list-manager" },
		{ name: "Update", href: "/custom-list-manager/update" },
	];

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					setPage((prevPage) => prevPage + 1);
				}
			},
			{ threshold: 1.0 }
		);

		const target = document.querySelector("#load-more-trigger");
		if (target) observer.observe(target);

		return () => {
			if (target) observer.unobserve(target);
		};
	}, []);

	const currentEntries = mediaList.slice(0, page * itemsPerPage);

	return (
		<Layout>
			<Breadcrumbs breadcrumbs={breadcrumbs} />
			<Card className="w-full max-w-4xl mx-auto bg-gray-800 text-gray-100 rounded-lg shadow-lg">
				<CardHeader>
					<CardTitle className="text-2xl">🚀 Update Custom Lists</CardTitle>
					<CardDescription className="text-gray-300">
						Start updating your AniList with customized conditions. You can pause or
						resume the update process at any time.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col items-center space-y-6">
						<Button
							onClick={toggleUpdate}
							disabled={done || isRateLimited}
							className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full flex items-center space-x-2 shadow-md transition-transform transform hover:scale-105"
							aria-label={
								isRateLimited
									? "Rate limited. Please wait."
									: !updating && !isPausedRef.current
									? "Start updating"
									: isPausedRef.current
									? "Resume updating"
									: "Pause updating"
							}
						>
							{isRateLimited ? (
								<>
									<FaPause aria-hidden="true" />
									<span>Rate Limited</span>
								</>
							) : !updating && !isPausedRef.current ? (
								<>
									<FaPlay aria-hidden="true" />
									<span>Start</span>
								</>
							) : !done ? (
								isPausedRef.current ? (
									<>
										<FaPlay aria-hidden="true" />
										<span>Resume</span>
									</>
								) : (
									<>
										<FaPause aria-hidden="true" />
										<span>Pause</span>
									</>
								)
							) : (
								<>
									<FaCheckCircle aria-hidden="true" />
									<span>Finished</span>
								</>
							)}
						</Button>
						<div className="w-full px-4">
							<div className="relative w-full h-4 bg-gray-700 rounded-full">
								<motion.div
									initial={{ width: 0 }}
									animate={{
										width:
											totalEntries === 0
												? 0
												: (updatedEntries.size / totalEntries) * 100 + "%",
									}}
									transition={{ duration: 0.5 }}
									className="h-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full border border-gray-500"
								/>
							</div>
							<p className="mt-2 text-center text-gray-300">
								{updatedEntries.size} / {totalEntries} Updated
							</p>
						</div>
						{currentEntry && !done && (
							<motion.div
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								className="w-full bg-gray-700 p-4 rounded-lg shadow-inner"
							>
								<p className="text-gray-200">
									Updating: <strong>{currentEntry.media.title.romaji}</strong>
								</p>
							</motion.div>
						)}
						{done && (
							<motion.div
								initial={{ scale: 0.8, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								className="flex items-center space-x-2 text-green-400"
							>
								<FaCheckCircle size={24} aria-hidden="true" />
								<span className="text-xl">All entries have been updated!</span>
							</motion.div>
						)}
						<div className="flex justify-between w-full">
							<Button
								variant="outline"
								asChild
								className="text-black hover:text-white border-gray-600 hover:bg-gray-700 transition-colors flex items-center space-x-2 px-4 py-2 rounded-md shadow-sm"
								aria-label="Back to Custom List Manager"
							>
								<Link href="/custom-list-manager">
									<span>Back</span>
								</Link>
							</Button>
							<Button
								onClick={handleFinish}
								className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md shadow-sm flex items-center space-x-2"
								aria-label="Finish updating"
							>
								<span>Finish</span>
							</Button>
						</div>
					</div>

					{retryCountdown > 0 && (
						<div className="mt-6 px-4 py-3 bg-yellow-700 text-yellow-100 rounded-lg flex items-center justify-between">
							<span>
								⚠️ Rate limit exceeded. Retrying in {retryCountdown - 1} seconds...
							</span>
						</div>
					)}
					{showNotice && (
						<div className="mt-6 px-4 py-3 bg-yellow-100 text-yellow-800 rounded-lg flex justify-between items-center">
							<span>
								Note: Media entries with <strong>hiddenFromStatusLists</strong> set
								to true and not associated with any custom lists will not be
								returned by the query and will not be displayed here.
							</span>
							<button
								onClick={() => setShowNotice(false)}
								className="text-yellow-800 hover:text-yellow-600 text-xl font-bold"
								aria-label="Dismiss notice"
							>
								&times;
							</button>
						</div>
					)}

					{!done && (
						<div className="mt-8 space-y-6">
							{loading ? (
								<div className="flex justify-center items-center h-40">
									<LoadingIndicator />
								</div>
							) : (
								currentEntries.length > 0 && (
									<AnimatePresence>
										{currentEntries.map((entry) => (
											<MediaCard
												key={entry.media.id}
												id={entry.media.id}
												image={entry.media.coverImage.extraLarge}
												romajiTitle={entry.media.title.romaji}
												englishTitle={entry.media.title.english || "N/A"}
												status={entry.status}
												score={entry.score}
												repeatCount={entry.repeat}
												customListChanges={Object.entries(entry.lists)
													.filter(
														([list, value]) =>
															value !== undefined &&
															value !== entry.customLists[list]
													)
													.map(
														([list, value]) =>
															`${list}: ${
																value
																	? "Add to list"
																	: "Remove from list"
															}`
													)}
												anilistLink={getMediaUrl(entry)}
												isUpdated={updatedEntries.has(entry.media.id)}
												onAnimationEnd={() =>
													handleAnimationEnd(entry.media.id)
												}
											/>
										))}
									</AnimatePresence>
								)
							)}
						</div>
					)}
					<div id="load-more-trigger" className="h-10"></div>
				</CardContent>
			</Card>
			<ToastContainer />
		</Layout>
	);
}
