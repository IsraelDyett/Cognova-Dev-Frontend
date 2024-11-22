"use client";

import { format } from "date-fns";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/data-table/column-header";
import { MoreHorizontal, Pencil, Trash2, Clock } from "lucide-react";
import { BusinessLocation, BusinessOperatingHours } from "@prisma/client";

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const operatingHoursColumns: ColumnDef<
	BusinessOperatingHours & { location: BusinessLocation }
>[] = [
	{
		accessorKey: "location",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Location" />,
		cell: ({ row }) => {
			const location = row.original.location.name;
			return <span className="font-medium">{location}</span>;
		},
	},
	{
		accessorKey: "dayOfWeek",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Day" />,
		cell: ({ row }) => {
			return (
				<span className="font-medium">
					{daysOfWeek[parseInt(row.getValue("dayOfWeek"))]}
				</span>
			);
		},
	},
	{
		accessorKey: "hours",
		header: "Hours",
		cell: ({ row }) => {
			const hours = row.original;
			return (
				<div className="flex items-center space-x-2">
					<Clock className="h-4 w-4 text-muted-foreground" />
					{hours.isClosed ? (
						<Badge variant="secondary">Closed</Badge>
					) : (
						<span>{`${hours.openTime} - ${hours.closeTime}`}</span>
					)}
				</div>
			);
		},
	},
	{
		accessorKey: "updatedAt",
		header: ({ column }) => (
			<DataTableColumnHeader hidden column={column} title="Last updated At" />
		),
		cell: ({ row }) => format(new Date(row.getValue("updatedAt")), "yyyy-MM-dd HH:mm"),
	},
	{
		accessorKey: "createdAt",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
		cell: ({ row }) => format(new Date(row.getValue("createdAt")), "yyyy-MM-dd HH:mm"),
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const hours = row.original;
			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-48 rounded-lg" side="right" align="start">
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem
							onClick={() => alert("Edit " + daysOfWeek[hours.dayOfWeek])}
						>
							<Pencil className="text-muted-foreground" />
							<span>Edit</span>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={() => alert("Delete " + daysOfWeek[hours.dayOfWeek])}
						>
							<Trash2 className="text-muted-foreground" />
							<span>Delete</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
