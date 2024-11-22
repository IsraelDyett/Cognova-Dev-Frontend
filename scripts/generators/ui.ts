const fs = require("fs");
const path = require("path");

// Types
interface Field {
  name: string;
  type: string;
  isOptional: boolean;
  isArray: boolean;
  defaultValue?: string;
  attributes: string[];
}

interface Model {
  name: string;
  fields: Field[];
  mappedName?: string;
}

// Schema parser
function parsePrismaSchema(filePath: string): Model {
  const content = fs.readFileSync(filePath, "utf8");
  const modelMatch = content.match(/model\s+(\w+)\s*{([^}]*)}/s);

  if (!modelMatch) {
    throw new Error("No model found in schema file");
  }

  const [_, modelName, modelContent] = modelMatch;
  const mappingMatch = content.match(/@@map\("([^"]+)"\)/);
  const mappedName = mappingMatch ? mappingMatch[1] : undefined;

  const fields: Field[] = [];
  const fieldLines = modelContent.trim().split("\n");

  for (const line of fieldLines) {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith("@@")) continue;

    const fieldMatch = trimmedLine.match(/(\w+)\s+(\w+)(\[\])?\s*(@[^]*)?/);
    if (fieldMatch) {
      const [_, name, type, isArray, attributes] = fieldMatch;
      const isOptional = trimmedLine.includes("?");
      const defaultMatch = trimmedLine.match(/@default\(([^)]+)\)/);
      const defaultValue = defaultMatch ? defaultMatch[1] : undefined;

      fields.push({
        name,
        type,
        isOptional,
        isArray: !!isArray,
        defaultValue,
        attributes: attributes ? attributes.split("@").filter(Boolean) : [],
      });
    }
  }

  return { name: modelName, fields, mappedName };
}

// Generator functions
function generateStore(model: Model, debug = true): string {
  return `
${debug && `import { debug } from "@/lib/utils";`}
import { create } from 'zustand';
import { toast } from 'sonner';
import { 
  create${model.name}, 
  update${model.name}, 
  delete${model.name}, 
  get${model.name}s 
} from './actions';
import type { ${model.name} } from '@prisma/client';

interface ${model.name}State {
  ${model.name.toLowerCase()}s: ${model.name}[];
  loading: boolean;
  error: string | null;

  // CRUD Form State
  initialCrudFormData?: ${model.name} | null;
  isOpenCrudForm: boolean;

  fetch${model.name}s: (workspaceId: string) => Promise<void>;
  create${model.name}: (data: Omit<${model.name}, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  update${model.name}: (id: string, data: Partial<${model.name}>) => Promise<void>;
  delete${model.name}: (id: string) => Promise<void>;

  // CRUD Form Actions
  onOpenCreateForm: () => void;
  onOpenEditForm: (data: ${model.name}) => void;
  onCloseCrudForm: () => void;
}

export const use${model.name}Store = create<${model.name}State>((set) => ({
  ${model.name.toLowerCase()}s: [],
  loading: true,
  error: null,

  initialCrudFormData: null,
  isOpenCrudForm: false,

  fetch${model.name}s: async (workspaceId: string) => {
    ${debug && `debug("CLIENT", "fetch${model.name}s", "STORE")`}
    set({ loading: true, error: null });
    try {
      const response = await get${model.name}s({ where: { workspaceId }});
      if (response.success) {
        set({ ${model.name.toLowerCase()}s: response.data });
      } else {
        throw new Error(response.error);
      }
    } catch (err: any) {
      const error: Error = err
      set({ error: error.message });
      toast.error('Failed to load ${model.name}s');
    } finally {
      set({ loading: false });
    }
  },
  create${model.name}: async (data) => {
    ${debug && `debug("CLIENT", "create${model.name}", "STORE")`}
    try {
      const response = await create${model.name}(data);
      if (response.success) {
        set((state) => ({
          ${model.name.toLowerCase()}s: [...state.${model.name.toLowerCase()}s, response?.data  ?? ({} as ${model.name})]
        }));
        toast.success('${model.name} created successfully');
      } else {
        throw new Error(response.error);
      }
    } catch (err: any) {
    const error: Error = err
      set({ error: error.message });
      toast.error('Failed to create ${model.name}');
    }
  },

  update${model.name}: async (id, data) => {
    ${debug && `debug("CLIENT", " update${model.name}", "STORE")`}
    try {
      const response = await update${model.name}(id, data);
      if (response.success) {
        set((state) => ({
          ${model.name.toLowerCase()}s: state.${model.name.toLowerCase()}s.map((item) =>
            item.id === id ? (response.data ?? ({} as ${model.name})) : item
          )
        }));
        toast.success('${model.name} updated successfully');
      } else {
        throw new Error(response.error);
      }
    } catch (err: any) {
    const error: Error = err
      set({ error: error.message });
      toast.error('Failed to update ${model.name}');
    }
  },

  delete${model.name}: async (id) => {
    ${debug && `debug("CLIENT", " delete${model.name}", "STORE")`}
    set({ loading: true, error: null });
    try {
      const response = await delete${model.name}(id);
      if (response.success) {
        set((state) => ({
          ${model.name.toLowerCase()}s: state.${model.name.toLowerCase()}s.filter((item) => item.id !== id)
        }));
        toast.success('${model.name} deleted successfully');
      } else {
        throw new Error(response.error);
      }
    } catch (err: any) {
    const error: Error = err
      set({ error: error.message });
      toast.error('Failed to delete ${model.name}');
    } finally {
      set({ loading: false });
    }
  },
  onOpenCreateForm: () => {
    set({
      isOpenCrudForm: true,
      initialCrudFormData: null
    });
  },

  onOpenEditForm: (data) => {
    set({
      isOpenCrudForm: true,
      initialCrudFormData: data
    });
  },

  onCloseCrudForm: () => {
    set({
      isOpenCrudForm: false,
      initialCrudFormData: null
    });
  }
}));
`;
}

function generateActions(model: Model, debug = true): string {
  return `
"use server";
${debug && `import { debug } from "@/lib/utils";`}
import { prisma } from "@/lib/services/prisma";
import type { ${model.name} } from '@prisma/client';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function create${model.name}(
  data: Omit<${model.name}, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ApiResponse<${model.name}>> {
  ${debug && `debug("SERVER", "create${model.name}", "PRISMA ACTIONS")`}
  try {
    const result = await prisma.${model.name.toLowerCase()}.create({
      data,
    });
    return { success: true, data: result };
  } catch (err: any) {
    const error: Error = err
    return { success: false, error: error.message };
  }
}

export async function update${model.name}(
  id: string,
  data: Partial<${model.name}>
): Promise<ApiResponse<${model.name}>> {
  ${debug && `debug("SERVER", "update${model.name}", "PRISMA ACTIONS")`}
  try {
    const result = await prisma.${model.name.toLowerCase()}.update({
      where: { id },
      data,
    });
    return { success: true, data: result };
  } catch (err: any) {
    const error: Error = err
    return { success: false, error: error.message };
  }
}

export async function delete${model.name}(
  id: string
): Promise<ApiResponse<${model.name}>> {
  ${debug && `debug("SERVER", "delete${model.name}", "PRISMA ACTIONS")`}
  try {
    const result = await prisma.${model.name.toLowerCase()}.delete({
      where: { id },
    });
    return { success: true, data: result };
  } catch (err: any) {
    const error: Error = err
    return { success: false, error: error.message };
  }
}

export async function retrieve${model.name}(
  id: string
): Promise<ApiResponse<${model.name}>> {
  ${debug && `debug("SERVER", "retrieve${model.name}", "PRISMA ACTIONS")`}
  try {
    const result = await prisma.${model.name.toLowerCase()}.findUnique({
      where: { id },
    });
    if (!result) {
      return { success: false, error: '${model.name} not found' };
    }
    return { success: true, data: result };
  } catch (err: any) {
    const error: Error = err
    return { success: false, error: error.message };
  }
}

export async function get${model.name}s(
  whereInput: { where?: any } = {}
): Promise<ApiResponse<${model.name}[]>> {
  ${debug && `debug("SERVER", "list${model.name}s", "PRISMA ACTIONS")`}
  try {
    const results = await prisma.${model.name.toLowerCase()}.findMany(whereInput);
    return { success: true, data: results };
  } catch (err: any) {
    const error: Error = err
    return { success: false, error: error.message };
  }
}
`;
}

function generateColumns(model: Model, hiddenFields = ["id", "updatedAt", "description"]): string {
  const displayableFields = model.fields.filter((f) => !hiddenFields.includes(f.name));

  return `
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
import type { ${model.name} } from "@prisma/client";
import { toast } from "sonner";
import { WorkspaceLink } from "@/app/(auth)/(workspace)/components/link";
import { format } from "date-fns";
import { use${model.name}Store } from "../store";
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

export const columns: ColumnDef<${model.name}>[] = [
  ${displayableFields
      .map(
        (field) => `{
    accessorKey: "${field.name}",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="${field.name.charAt(0).toUpperCase() + field.name.slice(1)}"
        />
      )
    },
    cell: ({ row,  }) => {
      return (
      ${field.type === "Boolean"
            ? `<Badge variant={row.getValue("${field.name}") ? "success" : "secondary"}>
              {row.getValue("${field.name}") ? "Yes" : "No"}
              </Badge>`
            : field.type === "Float"
              ? `<div className="font-medium">
            ${field.name === "price" ? "$ " : ""}
            {Number(row.getValue("${field.name}")).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </div>`
              : field.type === "Int"
                ? `<div className="font-medium">
            {Number(row.getValue("${field.name}")).toLocaleString()}
          </div>`
                : field.isArray
                  ? `<div className="font-medium">
            {(row.getValue("${field.name}") as string[]).length} items
          </div>`
                  : field.type === "DateTime"
                    ? ` <div className="font-medium">
              {format(new Date(row.getValue("${field.name}")), "yyyy-MM-dd HH:mm")}
          </div>
                  `
                    : `<div className="font-medium">{row.getValue("${field.name}")}</div>`
          }
      )
    }
  }`,
      )
      .join(",\n")},
  {
    id: "actions",
    cell: ({ row }) => {
      const item = row.original;
      const { delete${model.name}, onOpenEditForm } = use${model.name}Store();

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
              <WorkspaceLink href={\`/${model.name.toLowerCase()}/\${item.id}\`}>
                <Eye className="h-4 w-4" />
                <span>View</span>
              </WorkspaceLink>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()} onClick={()=> onOpenEditForm(item)}>
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
                    <AlertDialogTitle>Delete ${model.name}</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this ${model.name.toLowerCase()}? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => delete${model.name}(item.id)}
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
`;
}

function generatePage(model: Model) {
  return `
"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useWorkspace } from "@/app/(auth)/(workspace)/contexts/workspace-context";
import { use${model.name}Store } from "./store";
import { columns } from "./components/columns";
import { ${model.name}Form } from "./components/form";
import DataTable from "@/components/ui/data-table";
import LoadingPageSpinner from "@/components/skeletons/loading-page-spinner";
import { NoStateComponent } from "./components/no-state";

export default function ${model.name}Dashboard() {
  const { workspace } = useWorkspace();
  const { 
    ${model.name.toLowerCase()}s, 
    loading, 
    error, 
    fetch${model.name}s,
    onOpenCreateForm,
  } = use${model.name}Store();

  const alreadyMounted = useRef(false);
  useEffect(() => {
    if (!alreadyMounted.current && workspace) {
      fetch${model.name}s(workspace.id);
      alreadyMounted.current = true;
    }
  }, [workspace, fetch${model.name}s]);

  if (loading) return <LoadingPageSpinner />;
  if (error) return <div>Error: {error}</div>;
  if (!${model.name.toLowerCase()}s.length && !loading) return <NoStateComponent />;

  return (
    <>
      <div className="container mx-auto p-4">
        <DataTable
          columns={columns}
          data={${model.name.toLowerCase()}s}
          searchField="name"
          toolBarChildren={
            <Button onClick={onOpenCreateForm}>
              <PlusIcon className="mr-2 h-4 w-4" /> Add New ${model.name}
            </Button>
          }
        />
      </div>

      {/* CRUD Form Dialog */}
      <${model.name}Form />
    </>
  );
}`;
}
function generateFormComponent(model: Model) {
  // Filter out system fields
  const formFields = model.fields.filter(
    (f) => !["id", "createdAt", "updatedAt"].includes(f.name),
  );

  // Determine grid layout based on number of fields
  let gridClassName = "space-y-4"; // Default for 4 or fewer fields
  let dialogSize = "lg";
  if (formFields.length > 4) {
    // For more than 4 fields, use grid layout
    gridClassName = "grid gap-4";
    dialogSize = "xl";
    if (formFields.length <= 6) {
      gridClassName += "grid-cols-1 sm:grid-cols-2";
      dialogSize = "2xl";
    } else if (formFields.length <= 8) {
      gridClassName += "grid-cols-1 sm:grid-cols-2 md:grid-cols-3";
      dialogSize = "3xl";
    } else {
      gridClassName += "grid-cols-1 sm:grid-cols-3 md:grid-cols-4";
      dialogSize = "3xl";
    }
  }

  // Determine which fields should take full width
  const shouldBeFullWidth = (field: Field) => {
    return (
      field.name === "description" ||
      field.isArray ||
      field.type === "Boolean" ||
      field.name === "notes" ||
      field.name === "content" ||
      field.name === "address"
    );
  };

  return `
"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormAction,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { use${model.name}Store } from "../store";
import type { ${model.name} } from "@prisma/client";

const formSchema = z.object({
  ${formFields
      .map((field) => {
        if (field.type === "String" && field.isArray) {
          return `${field.name}: z.array(z.string())${field.isOptional ? ".optional()" : ""}`;
        }
        if (field.type === "String") {
          return `${field.name}: z.string()${field.isOptional ? ".optional()" : '.min(1, "Required")'}`;
        }
        if (field.type === "Int") {
          return `${field.name}: z.number()${field.isOptional ? ".optional()" : ""}`;
        }
        if (field.type === "Float") {
          return `${field.name}: z.number()${field.isOptional ? ".optional()" : ""}`;
        }
        if (field.type === "Boolean") {
          return `${field.name}: z.boolean()${field.isOptional ? ".optional()" : ""}`;
        }
        return `${field.name}: z.string()${field.isOptional ? ".optional()" : ""}`;
      })
      .join(",\n  ")}
});

type FormValues = z.infer<typeof formSchema>;

const defaultValues = {
      ${formFields
      .map((field) => {
        if (field.isArray) {
          return `${field.name}: []`;
        }
        if (field.type === "Boolean") {
          return `${field.name}: false`;
        }
        if (field.type === "Int" || field.type === "Float") {
          return `${field.name}: 0`;
        }
        return `${field.name}: ""`;
      })
      .join(",\n      ")}
  }
export function ${model.name}Form() {
  const { create${model.name}, update${model.name}, onCloseCrudForm, initialCrudFormData, isOpenCrudForm } = use${model.name}Store();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues, 
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: FormValues) => {
    try {
      if (initialCrudFormData) {
        await update${model.name}(initialCrudFormData.id, values);
      } else {
        // @ts-ignore
        await create${model.name}(values);
      }
      onCloseCrudForm();
    } catch (error) {
      toast.error('Something went wrong');
    }
  };
  useEffect(() => {
    if (isOpenCrudForm && initialCrudFormData) {
      form.reset({
      ${formFields
      .map((field) => {
        if (field.isArray) {
          return `${field.name}: initialCrudFormData?.${field.name} || []`;
        }
        if (field.type === "Boolean") {
          return `${field.name}: initialCrudFormData?.${field.name} || false`;
        }
        if (field.type === "Int" || field.type === "Float") {
          return `${field.name}: initialCrudFormData?.${field.name} || 0`;
        }
        return `${field.name}: initialCrudFormData?.${field.name} || ""`;
      })
      .join(",\n      ")}
    });
    } else if (isOpenCrudForm) {
      form.reset(defaultValues);
    }
  }, [initialCrudFormData, isOpenCrudForm, form]);

  return (
    <Dialog open={isOpenCrudForm} onOpenChange={onCloseCrudForm}>
      <DialogContent size={"${dialogSize}"}>
        <DialogHeader>
          <DialogTitle>
            {initialCrudFormData ? 'Edit' : 'Create'} ${model.name}
          </DialogTitle>
          <DialogDescription>
            {initialCrudFormData ? 'Make changes to the' : 'Add a new'} ${model.name.toLowerCase()}.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="${gridClassName}">
            ${formFields
      .map((field) => {
        const fullWidthClass = shouldBeFullWidth(field) ? "col-span-full" : "";

        if (field.type === "Boolean") {
          return `
              <FormField
                control={form.control}
                name="${field.name}"
                render={({ field }) => (
                  <FormItem className="flex flex-col ${fullWidthClass}">
                  <FormLabel className="text-base">
                    ${field.name.charAt(0).toUpperCase() + field.name.slice(1)}
                  </FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />`;
        }
        if (field.name === "description" || field.isArray) {
          return `
              <FormField
                control={form.control}
                name="${field.name}"
                render={({ field }) => (
                  <FormItem className="${fullWidthClass}">
                    <FormLabel>
                      ${field.name.charAt(0).toUpperCase() + field.name.slice(1)}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        disabled={isLoading}
                        placeholder="Enter ${field.name}"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />`;
        }
        if (field.type === "Float" || field.type === "Int") {
          return `
              <FormField
                control={form.control}
                name="${field.name}"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      ${field.name.charAt(0).toUpperCase() + field.name.slice(1)}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        disabled={isLoading}
                        placeholder="Enter ${field.name}"
                        {...field}
                        onChange={(e) => field.onChange(${field.type === "Int" ? "parseInt" : "parseFloat"}(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />`;
        }
        return `
              <FormField
                control={form.control}
                name="${field.name}"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      ${field.name.charAt(0).toUpperCase() + field.name.slice(1)}
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="Enter ${field.name}"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />`;
      })
      .join("\n            ")}
            <DialogFooter className="col-span-full">
              <Button
                disabled={isLoading}
                variant="outline"
                onClick={onCloseCrudForm}
                type="button"
              >
                Cancel
              </Button>
              <FormAction className="w-fit mt-0">
                {initialCrudFormData ? 'Save changes' : 'Create'}
              </FormAction>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
`;
}
function generateNoState(model: Model): string {
  return `
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { use${model.name}Store } from "../store";
import { WorkspaceLink } from "@/app/(auth)/(workspace)/components/link";


export function NoStateComponent() {
  const { onOpenCreateForm } = use${model.name}Store();
  return (
    <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        <h3 className="mt-4 text-lg font-semibold">No ${model.name}s added</h3>
        <p className="mb-4 mt-2 text-sm text-muted-foreground">
          Add your first ${model.name.toLowerCase()} to get started.
        </p>
        <Button onClick={onOpenCreateForm}>
              <PlusIcon className="mr-2 h-4 w-4" /> Add ${model.name}
            </Button>
      </div>
    </div>
  );
}`;
}

// Main generator function
async function generateUI(outputPath: string, schemaPath: string) {
  try {
    // Parse schema
    const model = parsePrismaSchema(schemaPath);

    // Create output directory structure
    const baseDir = path.join(outputPath);
    const componentsDir = path.join(baseDir, "components");

    fs.mkdirSync(baseDir, { recursive: true });
    fs.mkdirSync(componentsDir, { recursive: true });

    // Generate files
    const files = [
      {
        path: path.join(baseDir, "store.ts"),
        content: generateStore(model),
      },
      {
        path: path.join(baseDir, "actions.ts"),
        content: generateActions(model),
      },
      {
        path: path.join(baseDir, "page.tsx"),
        content: generatePage(model),
      },
      {
        path: path.join(componentsDir, "columns.tsx"),
        content: generateColumns(model),
      },
      {
        path: path.join(componentsDir, "no-state.tsx"),
        content: generateNoState(model),
      },
      {
        path: path.join(componentsDir, "form.tsx"),
        content: generateFormComponent(model),
      },
    ];

    // Write all files
    for (const file of files) {
      fs.writeFileSync(file.path, file.content, "utf8");
      console.log(`Generated: ${file.path}`);
    }

    console.log(`\nSuccessfully generated UI components for ${model.name} in ${baseDir}`);
  } catch (err: any) {
    const error: Error = err;
    console.error("Error generating UI components:", error);
    process.exit(1);
  }
}

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length !== 2) {
    console.error("Usage: ts-node gen-ui.ts <output-dir> <schema-file>");
    process.exit(1);
  }

  const [outputDir, schemaFile] = args;
  generateUI(outputDir, schemaFile);
}
