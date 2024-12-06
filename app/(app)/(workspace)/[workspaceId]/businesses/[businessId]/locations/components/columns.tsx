import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
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
import type { BusinessLocation } from "@prisma/client";
import { MoreHorizontal, Pencil, Trash2, MapPin, Mail, Phone, Eye } from "lucide-react";
import { format } from "date-fns";
import { useBusinessLocationStore } from "../store";
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
import { WorkspaceLink } from "@/app/(app)/(workspace)/components/link";

export const columns: ColumnDef<BusinessLocation>[] = [
	{
		accessorKey: "name",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
		cell: ({ row }) => {
			return (
				<div className="flex items-center space-x-2">
					<div className="font-medium">{row.getValue("name")}</div>
					{row.original.isMain && <Badge variant="secondary">Main</Badge>}
				</div>
			);
		},
	},
	{
		accessorKey: "address",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Address" />,
		cell: ({ row }) => {
			const location = row.original;
			return (
				<div className="flex items-center space-x-2">
					<MapPin className="h-4 w-4 text-muted-foreground" />
					<span>{`${location.address}, ${location.city}, ${location.country}`}</span>
				</div>
			);
		},
	},
	{
		accessorKey: "contact",
		header: "Contact",
		cell: ({ row }) => {
			const location = row.original;
			return (
				<div className="space-y-1">
					{location.email && (
						<div className="flex items-center space-x-2">
							<Mail className="h-4 w-4 text-muted-foreground" />
							<span>{location.email}</span>
						</div>
					)}
					{location.phone && (
						<div className="flex items-center space-x-2">
							<Phone className="h-4 w-4 text-muted-foreground" />
							<span>{location.phone}</span>
						</div>
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
			const item = row.original;
			// eslint-disable-next-line react-hooks/rules-of-hooks
			const { deleteBusinessLocation, onOpenEditForm } = useBusinessLocationStore();

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
										<AlertDialogTitle>Delete BusinessLocation</AlertDialogTitle>
										<AlertDialogDescription>
											Are you sure you want to delete this businesslocation?
											This action cannot be undone.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>Cancel</AlertDialogCancel>
										<AlertDialogAction
											onClick={() => deleteBusinessLocation(item.id)}
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
