"use client";
import * as React from "react";
import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	VisibilityState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { DataTableToolbar } from "./toolbar";
import { DataTablePagination } from "./pagination";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
export default function DataTable({
	data,
	columns,
	searchField,
	toolBarChildren,
	initialPageSize = 10,
	tableRowLink,
}: {
	data: any[];
	columns: ColumnDef<any>[];
	searchField: string;
	toolBarChildren?: React.ReactNode;
	initialPageSize?: number;
	tableRowLink?: string;
}) {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = React.useState({});

	const table = useReactTable({
		data,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		initialState: {
			sorting: [{ id: "createdAt", desc: true }],
			pagination: {
				pageSize: initialPageSize,
			},
		},
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
	});

	const router = useRouter();
	const getFormattedLink = (row: any, linkTemplate?: string) => {
		if (!linkTemplate) return "";

		return linkTemplate.replace(/\{(\w+)\}/g, (_, key) => {
			return row.original[key]?.toString() || "";
		});
	};

	return (
		<div className="w-full">
			<DataTableToolbar
				searchField={searchField}
				table={table}
				toolBarChildren={toolBarChildren}
			/>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead
											key={header.id}
											className="text-nowrap shrink-0 whitespace-nowrap"
										>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									className={cn(
										tableRowLink ? "cursor-pointer" : "cursor-default",
									)}
									onClick={() => {
										tableRowLink
											? router.push(getFormattedLink(row, tableRowLink))
											: {};
									}}
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell
											key={cell.id}
											className="text-nowrap shrink-0 whitespace-nowrap"
										>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="h-24 text-center">
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<DataTablePagination table={table} />
		</div>
	);
}
