"use client";

import React from "react";
import { motion } from "framer-motion";
import NumberTicker from "@/components/ui/number-ticker";

export default function StatsSection() {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20, height: 0 }}
			animate={{ opacity: 1, y: 0, height: "auto" }}
			className="mt-20 grid grid-cols-2 gap-8 md:grid-cols-4"
		>
			{[
				{
					label: "Active Users",
					value: 100,
				},
				{
					label: "Messages/Day",
					value: 1000,
				},
			].map((stat, index) => (
				<div key={index} className="text-center">
					<motion.div
						whileHover={{ scale: 1.05 }}
						className="text-3xl font-bold text-primary"
					>
						<NumberTicker
							className="text-3xl font-bold text-primary"
							value={stat.value}
						/>{" "}
						+
					</motion.div>
					<div className="text-sm text-gray-600">{stat.label}</div>
				</div>
			))}
			{[
				{ label: "Response Rate", value: "99%" },
				{ label: "Satisfaction", value: "4.9/5" },
			].map((stat, index) => (
				<div key={index} className="text-center">
					<motion.div
						whileHover={{ scale: 1.05 }}
						className="text-3xl font-bold text-primary"
					>
						{stat.value}
					</motion.div>
					<div className="text-sm text-gray-600">{stat.label}</div>
				</div>
			))}
		</motion.div>
	);
}
