"use client";

import React, { forwardRef, useState, useEffect, useRef } from "react";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
	SelectScrollUpButton,
	SelectScrollDownButton,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { FaSearch } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { useTextWidth } from "@/hooks/use-text-width";

interface SelectOption {
	label: string;
	value: string;
}

interface SelectOptionGroup {
	label: string;
	items: SelectOption[];
}

interface DynamicSelectProps {
	value: string;
	onValueChange: (value: string) => void;
	options: SelectOptionGroup[];
	placeholder?: string;
	className?: string;
}

export const DynamicSelect = forwardRef<HTMLButtonElement, DynamicSelectProps>(
	({ value, onValueChange, options, placeholder = "Select an option", className = "" }, ref) => {
		const allOptionsFlat = options.flatMap((group) => group.items);
		const currentLabel =
			allOptionsFlat.find((item) => item.value === value)?.label || placeholder;

		const currentWidth = useTextWidth(currentLabel);

		const [isOpen, setIsOpen] = useState(false);
		const [searchQuery, setSearchQuery] = useState("");
		const [filteredOptions, setFilteredOptions] = useState<SelectOptionGroup[]>(options);

		const inputRef = useRef<HTMLInputElement>(null);

		useEffect(() => {
			if (isOpen) {
				setSearchQuery("");
				setFilteredOptions(options);
				setTimeout(() => {
					inputRef.current?.focus();
				}, 100);
			}
		}, [isOpen, options]);

		useEffect(() => {
			if (searchQuery.trim() === "") {
				setFilteredOptions(options);
			} else {
				const lowerQuery = searchQuery.toLowerCase();
				const newFiltered = options
					.map((group) => ({
						label: group.label,
						items: group.items.filter((item) =>
							item.label.toLowerCase().includes(lowerQuery)
						),
					}))
					.filter((group) => group.items.length > 0);
				setFilteredOptions(newFiltered);
			}
		}, [searchQuery, options]);

		const handleSelectChange = (selectedValue: string) => {
			onValueChange(selectedValue);
			setSearchQuery("");
		};

		return (
			<Select value={value} onValueChange={handleSelectChange} onOpenChange={setIsOpen}>
				<SelectTrigger
					ref={ref}
					className={`bg-gray-700 text-gray-200 ${className}`}
					style={{ width: `${currentWidth + 32}px` }}
					aria-haspopup="listbox"
					aria-expanded={isOpen}
				>
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent className="bg-gray-700 text-gray-200" role="listbox">
					<div className="px-2 py-2">
						<div className="flex items-center px-2 py-1 bg-gray-600 rounded">
							<FaSearch className="text-gray-400 mr-2" />
							<Input
								ref={inputRef}
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								placeholder="Search..."
								className="bg-gray-600 text-gray-200 border-none focus:ring-0"
								aria-label="Search options"
								onMouseDown={(e) => e.stopPropagation()}
								onClick={(e) => e.stopPropagation()}
								onKeyDown={(e) => e.stopPropagation()}
							/>
						</div>
					</div>
					<div className="p-1">
						{filteredOptions.length > 0 ? (
							filteredOptions.map((group) => (
								<SelectGroup key={group.label}>
									<SelectLabel>{group.label}</SelectLabel>
									{group.items.map((item) => (
										<SelectItem
											key={item.value}
											value={item.value}
											role="option"
										>
											{item.label}
										</SelectItem>
									))}
								</SelectGroup>
							))
						) : (
							<div className="px-4 py-2 text-gray-300">No results found.</div>
						)}
					</div>
					<SelectScrollUpButton />
					<SelectScrollDownButton />
				</SelectContent>
			</Select>
		);
	}
);

DynamicSelect.displayName = "DynamicSelect";
