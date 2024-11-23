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
import { format } from "date-fns";
import { ProductsStoreState, useProductStore } from "../store";
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
import { WorkspaceLink } from "@/app/(auth)/(workspace)/components/link";

export const columns: ColumnDef<ProductsStoreState['products']['0']>[] = [
	{
		accessorKey: "categoryId",
		header: ({ column }) => <DataTableColumnHeader column={column} title="CategoryId" />,
		cell: ({ row }) => <div className="font-medium">{row.getValue("categoryId")}</div>,
	},
	{
		accessorKey: "name",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
		cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
	},
	{
		accessorKey: "price",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Price" />,
		cell: ({ row }) => {
			const configuration = row.original.business.configurations
			return (
				<div className="font-medium">
					{configuration?.currency || "$"}
					{Number(row.getValue("price")).toLocaleString(undefined, {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2,
					})}
				</div>
			)
		},
	},
	{
		accessorKey: "stock",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Stock" />,
		cell: ({ row }) => (
			<div className="font-medium">{Number(row.getValue("stock")).toLocaleString()}</div>
		),
	},
	{
		accessorKey: "sku",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Sku" />,
		cell: ({ row }) => <div className="font-medium">{row.getValue("sku")}</div>,
	},
	{
		accessorKey: "images",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Images" />,
		cell: ({ row }) => (
			<div className="font-medium">{(row.getValue("images") as string[]).length} items</div>
		),
	},
	{
		accessorKey: "isActive",
		header: ({ column }) => <DataTableColumnHeader column={column} title="IsActive" />,
		cell: ({ row }) => (
			<Badge variant={row.getValue("isActive") ? "success" : "secondary"}>
				{row.getValue("isActive") ? "Yes" : "No"}
			</Badge>
		),
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
			const { deleteProduct, onOpenEditForm } = useProductStore();

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
							<WorkspaceLink href={`/product/${item.id}`}>
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
										<AlertDialogTitle>Delete Product</AlertDialogTitle>
										<AlertDialogDescription>
											Are you sure you want to delete this item? This action
											cannot be undone.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>Cancel</AlertDialogCancel>
										<AlertDialogAction
											onClick={() => deleteProduct(item.id)}
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
