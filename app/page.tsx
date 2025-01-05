import Layout from "@/components/layout";
import ToastContainer from "@/components/ui/toast-container";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { FaArrowsAlt, FaSort, FaSyncAlt } from "react-icons/fa";

export default function Page() {
	return (
		<Layout>
			<div className="flex flex-col items-center justify-center bg-gray-900 text-gray-100 px-4">
				{/* Hero Section */}
				<div className="w-full max-w-4xl bg-gray-800 rounded-lg shadow-lg p-8 mb-12">
					<CardHeader>
						<CardTitle className="text-4xl font-bold text-white">
							Anilist Custom List Manager
						</CardTitle>
						<CardDescription className="text-gray-300 mt-2">
							Manage your anime and manga lists with ease
						</CardDescription>
					</CardHeader>
					<CardContent>
						<p className="mb-6 text-gray-200">
							Take full control of your Anilist experience by organizing your entries
							into customized lists. Whether you&apos;re tracking anime, manga, or
							both, our tool offers advanced features to suit your needs.
						</p>
						<div className="flex space-x-4">
							<Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
								<Link href="/anilist-login">Get Started</Link>
							</Button>
							<Button
								variant="outline"
								asChild
								className="text-black hover:text-white border-gray-600 hover:bg-gray-700 transition-colors"
							>
								<Link href="/about">Learn More</Link>
							</Button>
						</div>
					</CardContent>
				</div>

				{/* Features Section */}
				<div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
					<div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
						<div className="mb-4">
							<FaArrowsAlt className="w-12 h-12 mx-auto text-blue-400" />
						</div>
						<h3 className="text-xl font-semibold mb-2">Move Your Entries</h3>
						<p className="text-gray-300">
							Effortlessly move your entries to specific custom lists, keeping your
							Anilist organized according to your preferences.
						</p>
					</div>
					<div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
						<div className="mb-4">
							<FaSort className="w-12 h-12 mx-auto text-blue-400" />
						</div>
						<h3 className="text-xl font-semibold mb-2">Sort Entries</h3>
						<p className="text-gray-300">
							Sort your entries based on status, score, rereads, genres, tags, and
							type to quickly find what you&apos;re looking for.
						</p>
					</div>
					<div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
						<div className="mb-4">
							<FaSyncAlt className="w-12 h-12 mx-auto text-blue-400" />
						</div>
						<h3 className="text-xl font-semibold mb-2">Update Entries</h3>
						<p className="text-gray-300">
							Automatically update entries based on the conditions you set, ensuring
							your lists are always up-to-date.
						</p>
					</div>
				</div>
			</div>
			<ToastContainer />
		</Layout>
	);
}
