import React from "react";

interface Breadcrumb {
	name: string;
	href?: string;
}

interface BreadcrumbsProps {
	breadcrumbs: Breadcrumb[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ breadcrumbs }) => {
	return (
		<nav aria-label="breadcrumb" className="breadcrumbs">
			<ol>
				{breadcrumbs.map((breadcrumb, index) => (
					<li key={index}>
						{breadcrumb.href ? (
							<a href={breadcrumb.href}>{breadcrumb.name}</a>
						) : (
							<span>{breadcrumb.name}</span>
						)}
					</li>
				))}
			</ol>
		</nav>
	);
};

export default Breadcrumbs;
