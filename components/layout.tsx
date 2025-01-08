"use client";

import { ReactNode, useEffect, useState } from "react";
import { I18nProvider } from "@lingui/react";
import { getI18n } from "@/lib/i18n";
import LanguageSelector from "@/components/language-selector";
import DarkModeToggle from "@/components/dark-mode-toggle";

interface LayoutProps {
	children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
	const [locale, setLocale] = useState(() => {
		if (typeof window !== "undefined") {
			return localStorage.getItem("locale") || "en";
		}
		return "en";
	});

	useEffect(() => {
		if (typeof window !== "undefined") {
			getI18n(locale);
			localStorage.setItem("locale", locale);
		}
	}, [locale]);

	return (
		<I18nProvider i18n={getI18n(locale)}>
			<div className="min-h-screen flex flex-col bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
				<header
					className="py-6 px-4 bg-white dark:bg-gray-800 flex justify-between items-center transition-colors duration-300"
					role="banner"
				>
					<h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
						Anilist Custom List Manager
					</h1>
					<div className="flex items-center space-x-4">
						<LanguageSelector locale={locale} setLocale={setLocale} />
						<DarkModeToggle />
					</div>
				</header>
				<main
					className="flex-grow flex items-center justify-center container mx-auto px-4 py-8 bg-gray-100 dark:bg-gray-900 transition-colors duration-300"
					role="main"
				>
					{children}
				</main>
				<footer
					className="py-4 px-4 bg-white dark:bg-gray-800 text-center text-gray-700 dark:text-gray-300 shadow-inner transition-colors duration-300"
					role="contentinfo"
				>
					<p>&copy; {new Date().getFullYear()} Anilist Custom List Manager</p>
				</footer>
			</div>
		</I18nProvider>
	);
}
