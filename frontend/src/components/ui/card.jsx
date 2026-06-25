import * as React from 'react'

export function Card({ className = '', ...props }) {
	return (
		<div className={`rounded-lg border bg-card p-4 ${className}`} {...props} />
	)
}

export function CardHeader({ className = '', ...props }) {
	return <div className={`mb-2 ${className}`} {...props} />
}

export function CardTitle({ className = '', ...props }) {
	return <h3 className={`text-lg font-semibold ${className}`} {...props} />
}

export function CardContent({ className = '', ...props }) {
	return <div className={className} {...props} />
}

export default Card
