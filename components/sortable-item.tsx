"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

interface SortableItemProps {
	id: string;
	children: React.ReactNode;
}

const SortableItem: React.FC<SortableItemProps> = React.memo(({ id, children }) => {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id,
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	};

	return (
		<li ref={setNodeRef} style={style} className="relative" role="listitem">
			<div
				{...attributes}
				{...listeners}
				className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 cursor-grab active:cursor-grabbing"
				role="button"
				aria-label="Drag to reorder"
			>
				<GripVertical className="h-5 w-5 text-gray-400" />
			</div>
			{children}
		</li>
	);
});

SortableItem.displayName = "SortableItem";

export { SortableItem };
