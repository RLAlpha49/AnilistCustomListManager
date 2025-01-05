"use client";

import { useState, useEffect } from "react";

export function useTextWidth(
	text: string,
	font: string = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
) {
	const [width, setWidth] = useState(0);

	useEffect(() => {
		const canvas = document.createElement("canvas");
		const context = canvas.getContext("2d");
		if (context) {
			context.font = font;
			const metrics = context.measureText(text);
			setWidth(Math.ceil(metrics.width) + 62);
		}
	}, [text, font]);

	return width;
}
