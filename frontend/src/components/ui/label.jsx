import * as React from "react"

import { cn } from "@/lib/utils"

export function Label({ className, ...props }) {
	return (
		<label
			className={cn("block text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50", className)}
			{...props}
		/>
	)
}

export default Label
