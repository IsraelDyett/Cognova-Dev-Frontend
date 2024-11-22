"use client";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DataTableToolbarProps<TData> {
	table: Table<TData>;
	onSearch?: (value: string) => void;
}

export function DataTableToolbar<TData>({
	table,
	searchField,
	toolBarChildren,
}: DataTableToolbarProps<TData> & {
	searchField: string;
	toolBarChildren?: React.ReactNode;
}) {
	const isFiltered = table.getState().columnFilters.length > 0;
	return (
		<div className="flex flex-col sm:flex-row items-center justify-between py-6">
			<div className="flex items-center w-full justify-between flex-wrap gap-2">
				<Input
					placeholder={`Search ${searchField}...`}
					value={(table.getColumn(searchField)?.getFilterValue() as string) ?? ""}
					onChange={(event: { target: { value: any } }) =>
						table.getColumn(searchField)?.setFilterValue(event.target.value)
					}
					className="md:max-w-sm grow"
				/>
				{isFiltered && (
					<Button
						variant="ghost"
						onClick={() => {
							table.resetColumnFilters();
						}}
						className="h-8 px-2 lg:px-3"
					>
						Reset
						<Cross2Icon className="ml-2 h-4 w-4" />
					</Button>
				)}
				<div className="grow md:grow-0 gap-2 flex flex-wrap [&>button]:grow md:[&>button]:grow-0">
					{toolBarChildren}
				</div>
			</div>
		</div>
	);
}
