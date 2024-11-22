
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
import type { Bot } from "@prisma/client";
import { toast } from "sonner";
import { WorkspaceLink } from "@/app/(auth)/(workspace)/components/link";
import { format } from "date-fns";
import { useBotStore } from "../store";
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

export const columns: ColumnDef<Bot>[] = [
  {
    accessorKey: "businessId",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="BusinessId"
        />
      )
    },
    cell: ({ row, }) => {
      return (
        <div className="font-medium">{row.getValue("businessId")}</div>
      )
    }
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="Name"
        />
      )
    },
    cell: ({ row, }) => {
      return (
        <div className="font-medium">{row.getValue("name")}</div>
      )
    }
  },
  {
    accessorKey: "language",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="Language"
        />
      )
    },
    cell: ({ row, }) => {
      return (
        <div className="font-medium">{row.getValue("language")}</div>
      )
    }
  },
  {
    accessorKey: "modelId",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="ModelId"
        />
      )
    },
    cell: ({ row, }) => {
      return (
        <div className="font-medium">{row.getValue("modelId")}</div>
      )
    }
  },
  {
    accessorKey: "waPhoneNumber",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="WaPhoneNumber"
        />
      )
    },
    cell: ({ row, }) => {
      return (
        <div className="font-medium">{row.getValue("waPhoneNumber")}</div>
      )
    }
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="CreatedAt"
        />
      )
    },
    cell: ({ row, }) => {
      return (
        <div className="font-medium">
          {format(new Date(row.getValue("createdAt")), "yyyy-MM-dd HH:mm")}
        </div>

      )
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const item = row.original;
      const { deleteBot, onOpenEditForm } = useBotStore();

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
              <WorkspaceLink href={`/bot/${item.id}`}>
                <Eye className="h-4 w-4" />
                <span>View</span>
              </WorkspaceLink>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()} onClick={() => onOpenEditForm(item)}>
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
                    <AlertDialogTitle>Delete Bot</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this bot? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => deleteBot(item.id)}
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
