import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash2, Eye, Clock } from "lucide-react";
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
import type { BusinessOperatingHours as Hour } from "@prisma/client";
import type { BusinessLocation } from "@prisma/client";
import { toast } from "sonner";
import { WorkspaceLink } from "@/app/(app)/(workspace)/components/link";
import { format } from "date-fns";
import { useHourStore } from "../store";
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
export const columns: ColumnDef<Hour & { location?: BusinessLocation }>[] = [
	{
		accessorKey: "location",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Location" />,
		cell: ({ row }) => {
			const location = row.original?.location?.name || "-";
			return <span className="font-medium">{location}</span>;
		},
	},
	{
		accessorKey: "dayOfWeek",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Day" />,
		cell: ({ row }) => {
			return <span className="font-medium">{row.getValue("dayOfWeek")}</span>;
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
			const { deleteHour, onOpenEditForm } = useHourStore();

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
										<AlertDialogTitle>Delete Hour</AlertDialogTitle>
										<AlertDialogDescription>
											Are you sure you want to delete this hour? This action
											cannot be undone.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>Cancel</AlertDialogCancel>
										<AlertDialogAction
											onClick={() => deleteHour(item.id)}
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
