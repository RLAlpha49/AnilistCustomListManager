"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { ExternalLink } from "lucide-react";
import { Trans } from "@lingui/react";

interface MediaCardProps {
	id: number;
	image: string;
	romajiTitle: string;
	englishTitle: string;
	status: string;
	score: number | null;
	repeatCount: number;
	customListChanges: string[];
	anilistLink: string;
	isUpdated: boolean;
	onAnimationEnd: (id: number) => void;
}

export default function MediaCard({
	id,
	image,
	romajiTitle,
	englishTitle,
	status,
	score,
	repeatCount,
	customListChanges,
	anilistLink,
	isUpdated,
	onAnimationEnd,
}: MediaCardProps) {
	const [isHovered, setIsHovered] = useState(false);

	useEffect(() => {
		if (isUpdated) {
			const timer = setTimeout(() => {
				onAnimationEnd(id);
			}, 500);

			return () => clearTimeout(timer);
		}
	}, [isUpdated, id, onAnimationEnd]);

	return (
		<div
			className={`flex flex-col sm:flex-row bg-gray-900 rounded-lg overflow-hidden transition-opacity duration-500 ${
				isUpdated ? "opacity-0" : "opacity-100"
			} ${
				isHovered ? "shadow-[0_0_15px_rgba(59,130,246,0.5)]" : "shadow-md"
			} max-w-2xl mx-auto relative`}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			role="article"
			aria-labelledby={`media-title-${id}`}
		>
			<div className="w-full sm:w-1/3 h-48 sm:h-auto relative">
				<Image src={image} alt={romajiTitle} fill className="object-cover" />
			</div>
			<div className="w-full sm:w-2/3 p-4 flex flex-col justify-between text-gray-200">
				<div>
					<h2 id={`media-title-${id}`} className="text-xl font-bold mb-1 text-white">
						{romajiTitle}
					</h2>
					<h3 className="text-md text-gray-400 mb-4">{englishTitle}</h3>
					<div className="mb-4 space-y-1">
						<p>
							<strong className="text-blue-300">
								<Trans id="label.status" message="Status:" />
							</strong>{" "}
							{status}
						</p>
						<p>
							<strong className="text-blue-300">
								<Trans id="label.score" message="Score:" />
							</strong>{" "}
							{score !== null ? (
								score
							) : (
								<Trans id="text.not_available" message="N/A" />
							)}
						</p>
						<p>
							<strong className="text-blue-300">
								<Trans id="label.repeat_count" message="Repeat Count:" />
							</strong>{" "}
							{repeatCount}
						</p>
					</div>
				</div>
				<div>
					<h4 className="font-semibold mb-2 text-blue-300">
						<Trans id="title.custom_list_changes" message="Custom List Changes:" />
					</h4>
					<ul className="list-disc list-inside text-sm">
						{customListChanges.map((change, index) => (
							<li key={index}>{change}</li>
						))}
					</ul>
				</div>
			</div>
			<a
				href={anilistLink}
				target="_blank"
				rel="noopener noreferrer"
				className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-colors duration-300"
				aria-label="View on Anilist"
				role="link"
			>
				<ExternalLink size={20} />
			</a>
		</div>
	);
}
