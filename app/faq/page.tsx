"use client";

import Layout from "@/components/layout";
import ToastContainer from "@/components/ui/toast-container";
import { ReactNode, Suspense, useState } from "react";
import { FaQuestionCircle, FaChevronDown, FaChevronUp, FaSearch } from "react-icons/fa";
import Breadcrumbs from "@/components/breadcrumbs";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Trans } from "@lingui/react";
import LoadingIndicator from "@/components/loading-indicator";

interface FAQItem {
	question: React.ReactNode;
	answer: React.ReactNode;
	category: React.ReactNode;
}

const faqData: FAQItem[] = [
	{
		category: <Trans id="category.getting_started" message="Getting Started" />,
		question: (
			<Trans
				id="question.what_is_anilist_custom_list_manager"
				message="What is AniList Custom List Manager?"
			/>
		),
		answer: (
			<Trans
				id="answer.what_is_anilist_custom_list_manager"
				message="AniList Custom List Manager is a tool that allows you to organize and manage your anime and manga lists on AniList with ease. It offers advanced features such as creating custom lists, sorting entries, and setting conditions to automate list updates."
			/>
		),
	},
	{
		category: <Trans id="category.account" message="Account" />,
		question: (
			<Trans
				id="question.how_do_i_connect_my_anilist_account"
				message="How do I connect my AniList account?"
			/>
		),
		answer: (
			<Trans
				id="answer.how_do_i_connect_my_anilist_account"
				message="To connect your AniList account, click on the 'Login with AniList' button on the AniList Login page. You'll be redirected to AniList's authorization page where you can grant access. Once authorized, you'll be redirected back to the application."
			/>
		),
	},
	{
		category: <Trans id="category.managing_lists" message="Managing Lists" />,
		question: (
			<Trans
				id="question.how_can_i_create_a_new_custom_list"
				message="How can I create a new custom list?"
			/>
		),
		answer: (
			<Trans
				id="answer.how_can_i_create_a_new_custom_list"
				message="Navigate to the Custom List Manager page and click on the 'Add New List' button. Enter the desired name for your new list and it will be added to your collection. You can then set conditions and organize your entries accordingly."
			/>
		),
	},
	{
		category: <Trans id="category.managing_lists" message="Managing Lists" />,
		question: (
			<Trans
				id="question.can_i_sort_and_organize_my_lists"
				message="Can I sort and organize my lists?"
			/>
		),
		answer: (
			<Trans
				id="answer.can_i_sort_and_organize_my_lists"
				message="Yes, the tool allows you to sort your lists based on various criteria such as status, score, rereads, genres, tags, and type. You can also drag and drop lists to reorder them according to your preferences."
			/>
		),
	},
	{
		category: <Trans id="category.managing_lists" message="Managing Lists" />,
		question: (
			<Trans
				id="question.what_conditions_can_i_set_for_my_lists"
				message="What conditions can I set for my lists?"
			/>
		),
		answer: (
			<Trans
				id="answer.what_conditions_can_i_set_for_my_lists"
				message="You can set conditions based on status (e.g., Watching, Completed), score ranges, genres, tags, formats, and more. These conditions help automate the organization of your entries into the appropriate custom lists."
			/>
		),
	},
	{
		category: <Trans id="category.technical" message="Technical" />,
		question: (
			<Trans
				id="question.how_does_the_application_handle_rate_limiting"
				message="How does the application handle rate limiting?"
			/>
		),
		answer: (
			<Trans
				id="answer.how_does_the_application_handle_rate_limiting"
				message="The application includes mechanisms to handle rate limiting by AniList's API. If rate limiting is encountered, the process will pause and retry after a specified cooldown period."
			/>
		),
	},
	{
		category: <Trans id="category.security" message="Security" />,
		question: <Trans id="question.is_my_data_safe" message="Is my data safe?" />,
		answer: (
			<Trans
				id="answer.is_my_data_safe"
				message="Yes, your data is handled securely. The application stores your AniList access token locally on your device and it is never stored elsewhere. This ensures that only you have access to it. All data transactions are performed through AniList's official API."
			/>
		),
	},
	{
		category: <Trans id="category.technical" message="Technical" />,
		question: (
			<Trans
				id="question.how_do_i_clear_cached_tokens"
				message="How do I clear cached tokens?"
			/>
		),
		answer: (
			<Trans
				id="answer.how_do_i_clear_cached_tokens"
				message="To clear cached tokens, navigate to the AniList Login page and click on the 'Clear Cached Token' button. This will remove your access token from local storage, and you'll need to log in again to reconnect your AniList account."
			/>
		),
	},
];

const uniqueCategoryIds = Array.from(
	new Set(faqData.map((item) => (item.category as React.ReactElement<{ id: string }>).props.id))
);

const categories = uniqueCategoryIds.map(
	(id) =>
		faqData.find(
			(item) => (item.category as React.ReactElement<{ id: string }>).props.id === id
		)?.category
);

function PageData() {
	const [activeCategory, setActiveCategory] = useState<string | null>(null);
	const [activeIndex, setActiveIndex] = useState<number | null>(null);
	const [searchTerm, setSearchTerm] = useState<string>("");

	const toggleCategory = (category: string) => {
		setActiveCategory(activeCategory === category ? null : category);
		setActiveIndex(null);
	};

	const toggleFAQ = (index: number) => {
		setActiveIndex(activeIndex === index ? null : index);
	};

	const filteredFAQ = faqData.filter((item) => {
		const questionId = (item.question as React.ReactElement<{ id: string }>).props.id;
		const answerId = (item.answer as React.ReactElement<{ id: string }>).props.id;
		const categoryId = (item.category as React.ReactElement<{ id: string }>).props.id;

		return (
			questionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
			answerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
			categoryId.toLowerCase().includes(searchTerm.toLowerCase())
		);
	});

	const expandedCategories = searchTerm
		? new Set(filteredFAQ.map((item) => item.category))
		: new Set();
	const expandedFAQs = searchTerm ? new Set(filteredFAQ.map((item, index) => index)) : new Set();

	return (
		<Layout>
			<Breadcrumbs
				breadcrumbs={[
					{ name: "Home", href: "/" },
					{ name: "FAQ", href: "/faq" },
				]}
			/>
			<div className="flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4 py-12">
				<div className="w-full max-w-xl">
					{/* Header Section */}
					<div className="mb-8 text-center">
						<FaQuestionCircle className="mx-auto mb-4 text-blue-500 dark:text-blue-400 w-16 h-16" />
						<h1 className="text-4xl font-bold">
							<Trans
								id="title.frequently_asked_questions"
								message="Frequently Asked Questions"
							/>
						</h1>
						<p className="text-gray-600 dark:text-gray-300 mt-2">
							<Trans
								id="description.find_answers"
								message="Find answers to the most common questions about AniList Custom List Manager."
							/>
						</p>
					</div>

					{/* Search Bar */}
					<div className="mb-6">
						<div className="relative">
							<FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
							<input
								type="text"
								placeholder="Search FAQs..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full pl-10 pr-4 py-2 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
							/>
						</div>
					</div>

					{/* FAQ Categories */}
					<div className="space-y-4">
						{categories.map((category, catIndex) => (
							<div
								key={catIndex}
								className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-colors duration-300"
							>
								<button
									onClick={() => toggleCategory(category as string)}
									className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
									aria-expanded={
										expandedCategories.has(category) ||
										activeCategory === category
									}
									aria-controls={`category-${catIndex}`}
								>
									<span className="text-xl font-semibold flex items-center text-gray-900 dark:text-white">
										<FaQuestionCircle className="mr-2 text-blue-500 dark:text-blue-400" />
										{category}
									</span>
									{expandedCategories.has(category) ||
									activeCategory === category ? (
										<FaChevronUp className="w-5 h-5 text-gray-400 dark:text-gray-500" />
									) : (
										<FaChevronDown className="w-5 h-5 text-gray-400 dark:text-gray-500" />
									)}
								</button>
								<AnimatePresence>
									{(expandedCategories.has(category) ||
										activeCategory === category) && (
										<motion.div
											id={`category-${catIndex}`}
											initial={{ height: 0, opacity: 0 }}
											animate={{ height: "auto", opacity: 1 }}
											exit={{ height: 0, opacity: 0 }}
											transition={{ duration: 0.3 }}
											className="px-6 py-4 border-t border-gray-200 dark:border-gray-700"
										>
											<div className="space-y-2">
												{filteredFAQ
													.filter(
														(item) =>
															item.category &&
															category &&
															(
																item.category as React.ReactElement<{
																	id: string;
																}>
															).props.id ===
																(
																	category as React.ReactElement<{
																		id: string;
																	}>
																).props.id
													)
													.map((item, index) => (
														<div
															key={index}
															className="bg-gray-50 dark:bg-gray-700 rounded-md shadow-sm overflow-hidden transition-colors duration-300"
														>
															<button
																onClick={() => toggleFAQ(index)}
																className="w-full px-4 py-2 text-left flex justify-between items-center focus:outline-none"
																aria-expanded={
																	expandedFAQs.has(index) ||
																	activeIndex === index
																}
																aria-controls={`faq-${catIndex}-${index}`}
															>
																<span className="text-lg font-medium text-gray-900 dark:text-white">
																	{item.question}
																</span>
																{expandedFAQs.has(index) ||
																activeIndex === index ? (
																	<FaChevronUp className="w-5 h-5 text-gray-400 dark:text-gray-500" />
																) : (
																	<FaChevronDown className="w-5 h-5 text-gray-400 dark:text-gray-500" />
																)}
															</button>
															<AnimatePresence>
																{(expandedFAQs.has(index) ||
																	activeIndex === index) && (
																	<motion.div
																		id={`faq-${catIndex}-${index}`}
																		initial={{
																			height: 0,
																			opacity: 0,
																		}}
																		animate={{
																			height: "auto",
																			opacity: 1,
																		}}
																		exit={{
																			height: 0,
																			opacity: 0,
																		}}
																		transition={{
																			duration: 0.3,
																		}}
																		className="px-4 py-2 bg-gray-100 dark:bg-gray-600 max-w-full"
																	>
																		<p className="text-gray-700 dark:text-gray-200 break-words">
																			{item.answer}
																		</p>
																	</motion.div>
																)}
															</AnimatePresence>
														</div>
													))}
											</div>
										</motion.div>
									)}
								</AnimatePresence>
							</div>
						))}
					</div>

					{/* Back to Home Link */}
					<div className="mt-8 text-center">
						<Link href="/" className="text-blue-500 hover:underline">
							<Trans id="link.back_to_home" message="Back to Home" />
						</Link>
					</div>
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
