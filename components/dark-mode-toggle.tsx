import React, { useEffect, useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

const DarkModeToggle: React.FC = () => {
	const [isDark, setIsDark] = useState<boolean>(false);

	useEffect(() => {
		const storedTheme = localStorage.getItem("theme");
		if (storedTheme) {
			setIsDark(storedTheme === "dark");
			if (storedTheme === "dark") {
				document.documentElement.classList.add("dark");
			} else {
				document.documentElement.classList.remove("dark");
			}
		} else {
			const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
			setIsDark(prefersDark);
			if (prefersDark) {
				document.documentElement.classList.add("dark");
			}
		}
	}, []);

	const toggleDarkMode = () => {
		const newIsDark = !isDark;
		setIsDark(newIsDark);
		if (newIsDark) {
			document.documentElement.classList.add("dark");
			localStorage.setItem("theme", "dark");
		} else {
			document.documentElement.classList.remove("dark");
			localStorage.setItem("theme", "light");
		}
	};

	return (
		<button
			onClick={toggleDarkMode}
			className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
			aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
		>
			{isDark ? <FaSun size={20} /> : <FaMoon size={20} />}
		</button>
	);
};

export default DarkModeToggle;