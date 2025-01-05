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
				<meta charSet="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>Anilist Custom List Manager</title>
				<meta name="description" content="Manage your anime and manga lists with ease" />
			</head>
			<body className={inter.className}>
				<AuthProvider>{children}</AuthProvider>
				<Script src="/googleAnalytics.js" strategy="afterInteractive" />
				<Analytics />
			</body>
		</html>
	);
}
