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
import { sourceTypes } from "../../constants";
import { ColumnDef } from "@tanstack/react-table";
import { Source, Sync, Technique } from "@prisma/client";
import { DataTableColumnHeader } from "@/components/ui/data-table/column-header";
import { AlertCircle, BadgeCheck, MoreHorizontal, Pencil, RefreshCcw, Trash2 } from "lucide-react";

type SourceWithExtra = Source & {
  syncs?: Sync[];
  technique?: Technique;
};

export const sourcesColumns: ColumnDef<SourceWithExtra>[] = [
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = sourceTypes.find((t) => t.type === row.original.technique?.name);
      return (
        <Badge variant={"secondary"}>
          {type?.icon && <type.icon className="size-4 mr-2" />}
          {type?.label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "url",
    header: "URL",
    cell: ({ row }) => {
      const source = row.original;
      return (
        <div className="flex items-center space-x-2">
          <div className="font-medium">{source.url}</div>
          {source.syncs?.[0]?.errorAt && <AlertCircle className="h-4 w-4 text-destructive" />}
        </div>
      );
    },
  },
  {
    accessorKey: "syncTime",
    header: "Sync Time",
    cell: ({ row }) => {
      return (
        <span className="text-sm text-end text-muted-foreground">{row.original.syncTime}s</span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return (
        <Badge variant={"success"}>
          <BadgeCheck className="size-4 mr-2" />
          {row.original.status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Last updated At" />,
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
      const source = row.original;
      const isRunning =
        source.syncs?.[0]?.startedAt &&
        !source.syncs?.[0]?.succeedAt &&
        !source.syncs?.[0]?.errorAt;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48 rounded-lg" side={"right"} align={"start"}>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => alert("Edit " + source.title)}>
              <Pencil className="text-muted-foreground" />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => alert("Sync " + source.title)} disabled={!isRunning}>
              <RefreshCcw className="text-muted-foreground" />
              <span>Re-Sync</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => alert("Delete " + source.title)}>
              <Trash2 className="text-muted-foreground" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
