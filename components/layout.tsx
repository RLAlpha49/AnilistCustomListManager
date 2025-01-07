"use client";

import { ReactNode, useEffect, useState } from "react";
import { I18nProvider } from "@lingui/react";
import { getI18n } from "@/lib/i18n";
import LanguageSelector from "@/components/language-selector";

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
			<div className="min-h-screen flex flex-col bg-gray-900 text-gray-100">
				<header
					className="py-6 px-4 bg-gray-800 flex justify-between items-center"
					role="banner"
				>
					<h1 className="text-2xl font-bold">Anilist Custom List Manager</h1>
					<LanguageSelector locale={locale} setLocale={setLocale} />
				</header>
				<main
					className="flex-grow flex items-center justify-center container mx-auto px-4 py-8"
					role="main"
				>
					{children}
				</main>
				<footer className="py-4 px-4 bg-gray-800 text-center" role="contentinfo">
					<p>&copy; {new Date().getFullYear()} Anilist Custom List Manager</p>
				</footer>
			</div>
		</I18nProvider>
	);
}
