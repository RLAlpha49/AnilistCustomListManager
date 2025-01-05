"use client";

import Layout from "@/components/layout";
import ToastContainer from "@/components/ui/toast-container";
import { useState } from "react";
import { FaQuestionCircle, FaChevronDown, FaChevronUp, FaSearch } from "react-icons/fa";
import Breadcrumbs from "@/components/breadcrumbs";
import { motion, AnimatePresence } from "framer-motion";

interface FAQItem {
	question: string;
	answer: string;
	category: string;
}

const faqData: FAQItem[] = [
	{
		category: "Getting Started",
		question: "What is AniList Custom List Manager?",
		answer: "AniList Custom List Manager is a tool that allows you to organize and manage your anime and manga lists on AniList with ease. It offers advanced features such as creating custom lists, sorting entries, and setting conditions to automate list updates.",
	},
	{
		category: "Account",
		question: "How do I connect my AniList account?",
		answer: "To connect your AniList account, click on the 'Login with AniList' button on the AniList Login page. You'll be redirected to AniList's authorization page where you can grant access. Once authorized, you'll be redirected back to the application.",
	},
	{
		category: "Managing Lists",
		question: "How can I create a new custom list?",
		answer: "Navigate to the Custom List Manager page and click on the 'Add New List' button. Enter the desired name for your new list and it will be added to your collection. You can then set conditions and organize your entries accordingly.",
	},
	{
		category: "Managing Lists",
		question: "Can I sort and organize my lists?",
		answer: "Yes, the tool allows you to sort your lists based on various criteria such as status, score, rereads, genres, tags, and type. You can also drag and drop lists to reorder them according to your preferences.",
	},
	{
		category: "Managing Lists",
		question: "What conditions can I set for my lists?",
		answer: "You can set conditions based on status (e.g., Watching, Completed), score ranges, genres, tags, formats, and more. These conditions help automate the organization of your entries into the appropriate custom lists.",
	},
	{
		category: "Technical",
		question: "How does the application handle rate limiting?",
		answer: "The application includes mechanisms to handle rate limiting by AniList's API. If rate limiting is encountered, the process will pause and retry after a specified cooldown period.",
	},
	{
		category: "Security",
		question: "Is my data safe?",
		answer: "Yes, your data is handled securely. The application stores your AniList access token locally on your device and it is never stored elsewhere. This ensures that only you have access to it. All data transactions are performed through AniList's official API.",
	},
	{
		category: "Technical",
		question: "How do I clear cached tokens?",
		answer: "To clear cached tokens, navigate to the AniList Login page and click on the 'Clear Cached Token' button. This will remove your access token from local storage, and you'll need to log in again to reconnect your AniList account.",
	},
];

const categories = Array.from(new Set(faqData.map((item) => item.category)));

export default function FAQPage() {
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

	const filteredFAQ = faqData.filter(
		(item) =>
			item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
			item.answer.toLowerCase().includes(searchTerm.toLowerCase())
	);

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
			<div className="flex flex-col items-center justify-center bg-gray-900 text-gray-100 px-4 py-12">
				<div className="w-full max-w-xl">
					<div className="mb-8 text-center">
						<FaQuestionCircle className="mx-auto mb-4 text-blue-500 w-16 h-16" />
						<h1 className="text-4xl font-bold">Frequently Asked Questions</h1>
						<p className="text-gray-300 mt-2">
							Find answers to the most common questions about AniList Custom List
							Manager.
						</p>
					</div>
					<div className="mb-6">
						<div className="relative">
							<FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
							<input
								type="text"
								placeholder="Search FAQs..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full pl-10 pr-4 py-2 rounded-md bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>
					</div>
					<div className="space-y-4">
						{categories.map((category, catIndex) => (
							<div
								key={catIndex}
								className="bg-gray-800 rounded-lg shadow-md overflow-hidden"
							>
								<button
									onClick={() => toggleCategory(category)}
									className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
									aria-expanded={
										expandedCategories.has(category) ||
										activeCategory === category
									}
									aria-controls={`category-${catIndex}`}
								>
									<span className="text-xl font-semibold flex items-center">
										<FaQuestionCircle className="mr-2" />
										{category}
									</span>
									{expandedCategories.has(category) ||
									activeCategory === category ? (
										<FaChevronUp className="w-5 h-5 text-gray-400" />
									) : (
										<FaChevronDown className="w-5 h-5 text-gray-400" />
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
											className="px-6 py-4 border-t border-gray-700"
										>
											<div className="space-y-2">
												{filteredFAQ
													.filter((item) => item.category === category)
													.map((item, index) => (
														<div
															key={index}
															className="bg-gray-700 rounded-md shadow-sm overflow-hidden"
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
																<span className="text-lg font-medium">
																	{item.question}
																</span>
																{expandedFAQs.has(index) ||
																activeIndex === index ? (
																	<FaChevronUp className="w-5 h-5 text-gray-400" />
																) : (
																	<FaChevronDown className="w-5 h-5 text-gray-400" />
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
																		className="px-4 py-2 bg-gray-600 max-w-full"
																	>
																		<p className="text-gray-200 break-words">
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
				</div>
			</div>
			<ToastContainer />
		</Layout>
	);
}
