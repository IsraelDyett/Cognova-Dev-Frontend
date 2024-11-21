"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
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
import { Business } from "@prisma/client";
import { toast } from "sonner";
import { useWorkspace } from "@/app/(workspace)/workspace-context";
import { WorkspaceLink } from "@/app/(workspace)/_components/link";

export const columns: ColumnDef<Business>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "type",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
    cell: ({ row }) => <Badge variant="secondary">{row.getValue("type")}</Badge>,
  },
  {
    accessorKey: "hasDelivery",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Delivery" />,
    cell: ({ row }) => (
      <Badge variant={row.getValue("hasDelivery") ? "success" : "secondary"}>
        {row.getValue("hasDelivery") ? "Yes" : "No"}
      </Badge>
    ),
  },
  {
    accessorKey: "acceptsReturns",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Accepts Returns" />,
    cell: ({ row }) => (
      <Badge variant={row.getValue("acceptsReturns") ? "success" : "secondary"}>
        {row.getValue("acceptsReturns") ? "Yes" : "No"}
      </Badge>
    ),
  },
  {
    accessorKey: "hasWarranty",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Warranty" />,
    cell: ({ row }) => (
      <Badge variant={row.getValue("hasWarranty") ? "success" : "secondary"}>
        {row.getValue("hasWarranty") ? "Yes" : "No"}
      </Badge>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const business = row.original;
      const { workspace } = useWorkspace();
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
              onClick={() =>
                navigator.clipboard.writeText(business.id).then(() => {
                  toast.info("Business ID Copied successfully");
                })
              }
            >
              Copy business ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <WorkspaceLink href={`/business/${business.id}`}>
                <Pencil className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </WorkspaceLink>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
