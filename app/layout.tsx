import "./globals.css";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/context/auth-context";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "Anilist Custom List Manager",
	description: "Manage your anime and manga lists with ease",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				{/* Inline Theme Setter Script */}
				<script
					dangerouslySetInnerHTML={{
						__html: `
							(function() {
								try {
									const theme = localStorage.getItem('theme');
									if (theme === 'dark') {
										document.documentElement.classList.add('dark');
									} else if (theme === 'light') {
										document.documentElement.classList.remove('dark');
									} else {
										// If no preference, check system preference
										if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
											document.documentElement.classList.add('dark');
										}
									}
								} catch (e) {
									console.error('Failed to set theme:', e);
								}
							})();
						`,
					}}
				></script>
			</head>
			<body className={inter.className}>
				<AuthProvider>{children}</AuthProvider>
				<Script src="/googleAnalytics.js" strategy="afterInteractive" />
				<Analytics />
			</body>
		</html>
	);
}
