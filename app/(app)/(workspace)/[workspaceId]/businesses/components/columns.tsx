"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/components/ui/data-table/column-header";
import type { Business } from "@prisma/client";
import { WorkspaceLink } from "@/app/(app)/(workspace)/components/link";
import { format } from "date-fns";
import { useBusinessStore } from "../store";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const columns: ColumnDef<Business>[] = [
	{
		accessorKey: "name",
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title="Name" />;
		},
		cell: ({ row }) => {
			return <div className="font-medium">{row.getValue("name")}</div>;
		},
	},
	{
		accessorKey: "createdAt",
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title="CreatedAt" />;
		},
		cell: ({ row }) => {
			return (
				<div className="font-medium">
					{format(new Date(row.getValue("createdAt")), "yyyy-MM-dd HH:mm")}
				</div>
			);
		},
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const item = row.original;
			// eslint-disable-next-line react-hooks/rules-of-hooks
			const { deleteBusiness, onOpenEditForm } = useBusinessStore();

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem asChild>
							<WorkspaceLink href={`/businesses/${item.id}`}>
								<Eye className="h-4 w-4" />
								<span>View</span>
							</WorkspaceLink>
						</DropdownMenuItem>
						<DropdownMenuItem
							onSelect={(e) => e.preventDefault()}
							onClick={() => onOpenEditForm(item)}
						>
							<Pencil className="h-4 w-4" />
							<span>Edit</span>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
							<AlertDialog>
								<AlertDialogTrigger asChild>
									<Button variant="ghost" className="w-full justify-start p-0">
										<Trash2 className="mr-2 h-4 w-4 text-destructive" />
										<span className="text-destructive">Delete</span>
									</Button>
								</AlertDialogTrigger>
								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>Delete Business</AlertDialogTitle>
										<AlertDialogDescription>
											Are you sure you want to delete this item? This action
											cannot be undone.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>Cancel</AlertDialogCancel>
										<AlertDialogAction
											onClick={() => deleteBusiness(item.id)}
											className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
										>
											Delete
										</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
