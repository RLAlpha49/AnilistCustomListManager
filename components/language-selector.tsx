"use client";

import { i18n } from "@lingui/core";
import { useState, useEffect, useRef } from "react";
import CountryFlag from "react-country-flag";
import { FaChevronDown, FaChevronUp, FaExclamationTriangle } from "react-icons/fa";
import { Trans } from "@lingui/react";

interface LanguageOption {
	locale: string;
	name: string;
	countryCode: string;
}

const languages: LanguageOption[] = [
	{ locale: "en", name: "English", countryCode: "US" },
	{ locale: "fr", name: "Français", countryCode: "FR" },
	{ locale: "es", name: "Español", countryCode: "ES" },
	{ locale: "jp", name: "日本語", countryCode: "JP" },
	{ locale: "cn", name: "简体中文", countryCode: "CN" },
	{ locale: "pt", name: "Português", countryCode: "BR" },
	{ locale: "ru", name: "Русский", countryCode: "RU" },
	{ locale: "ko", name: "한국어", countryCode: "KR" },
];

interface LanguageSelectorProps {
	locale: string;
	setLocale: (locale: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ locale, setLocale }) => {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const handleSelect = (selectedLocale: string) => {
		setLocale(selectedLocale);
		i18n.activate(selectedLocale);
		setIsOpen(false);
	};

	const toggleDropdown = () => {
		setIsOpen(!isOpen);
	};

	const selectedLanguage = languages.find((lang) => lang.locale === locale) || languages[0];

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<div className="flex items-center space-x-4" ref={dropdownRef}>
			{/* Warning Message */}
			{locale !== "en" && (
				<div className="flex items-center bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-2 rounded-md">
					<FaExclamationTriangle className="w-5 h-5 mr-2" />
					<p className="text-sm">
						<Trans
							id="languageSelector.warning"
							message="The selected language is machine-translated and some content may not be fully accurate or complete."
						/>
					</p>
				</div>
			)}

			{/* Language Selector Dropdown */}
			<div className="relative inline-block text-left">
				<button
					onClick={toggleDropdown}
					className="inline-flex items-center px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
				>
					<CountryFlag
						countryCode={selectedLanguage.countryCode}
						svg
						style={{
							width: "1.5em",
							height: "1.5em",
							marginRight: "0.5rem",
						}}
						title={selectedLanguage.name}
					/>
					{selectedLanguage.name}
					{isOpen ? <FaChevronUp className="ml-2" /> : <FaChevronDown className="ml-2" />}
				</button>

				{isOpen && (
					<div className="absolute right-0 mt-2 w-40 bg-gray-800 rounded-md shadow-lg z-10">
						<div className="py-1">
							{languages.map((lang) => (
								<button
									key={lang.locale}
									onClick={() => handleSelect(lang.locale)}
									className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700 flex items-center"
								>
									<CountryFlag
										countryCode={lang.countryCode}
										svg
										style={{
											width: "1.5em",
											height: "1.5em",
											marginRight: "0.5rem",
										}}
										title={lang.name}
									/>
									{lang.name}
								</button>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default LanguageSelector;
