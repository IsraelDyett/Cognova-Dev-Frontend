'use client'

import { useState } from 'react'
import { FileText, Globe, FileType, Plus, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    ColumnFiltersState,
    getFilteredRowModel,
} from '@tanstack/react-table'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { FaFilePdf} from "react-icons/fa6"
import { CgWebsite } from "react-icons/cg"

type SourceType = 'pdf' | 'website' | 'text'

interface Source {
    id: number
    type: SourceType
    name: string
    progress: number
}

const sourceTypes: { type: SourceType; icon: React.ElementType; label: string }[] = [
    { type: 'pdf', icon: FileText, label: 'PDF' },
    { type: 'website', icon: Globe, label: 'Website' },
    { type: 'text', icon: FileType, label: 'Text File' },
]

export default function SourcesPage() {
    const [sources, setSources] = useState<Source[]>([
        { id: 1, type: 'pdf', name: 'Product Manual.pdf', progress: 75 },
        { id: 2, type: 'website', name: 'https://example.com', progress: 100 },
        { id: 3, type: 'text', name: 'Meeting Notes.txt', progress: 50 },
    ])
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [newSource, setNewSource] = useState<Partial<Source>>({ type: 'pdf', name: '', progress: 0 })
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

    const columns: ColumnDef<Source>[] = [
        {
            accessorKey: 'type',
            header: 'Type',
            cell: ({ row }) => {
                const type = row.getValue('type') as SourceType
                const sourceType = sourceTypes.find(st => st.type === type)
                return (
                    <div className="flex items-center">
                        {sourceType && <sourceType.icon className="mr-2 h-4 w-4" />}
                        {sourceType?.label}
                    </div>
                )
            },
        },
        {
            accessorKey: 'name',
            header: 'Name',
        },
        {
            accessorKey: 'progress',
            header: 'Progress',
            cell: ({ row }) => (
                <Progress value={row.getValue('progress')} className="w-[60%]" />
            ),
        },
        {
            id: 'actions',
            cell: ({ row }) => {
                const source = row.original
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
                            <DropdownMenuItem onClick={() => console.log('Edit', source)}>Edit</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => console.log('Delete', source)}>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]

    const table = useReactTable({
        data: sources,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
        },
    })

    const handleAddSource = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (newSource.type && newSource.name) {
            const sourceToAdd: Source = {
                id: sources.length + 1,
                type: newSource.type,
                name: newSource.name,
                progress: newSource.progress || 0,
            }
            setSources([...sources, sourceToAdd])
            setIsAddDialogOpen(false)
            setNewSource({ type: 'pdf', name: '', progress: 0 })
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col space-y-3">
                <div className='w-full flex justify-between items-center'>
                    <h2 className="text-2xl font-bold">Sources</h2>
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" /> Add Source
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Source</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleAddSource} className="space-y-4">
                                <div>
                                    <Label htmlFor="sourceType">Source Type</Label>
                                    <Select
                                        value={newSource.type}
                                        onValueChange={(value: SourceType) => setNewSource({ ...newSource, type: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select source type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {sourceTypes.map(({ type, label }) => (
                                                <SelectItem key={type} value={type}>{label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="sourceName">Source Name</Label>
                                    <Input
                                        id="sourceName"
                                        value={newSource.name}
                                        onChange={(e) => setNewSource({ ...newSource, name: e.target.value })}
                                        placeholder="Enter source name"
                                    />
                                </div>
                                <Button type="submit">Add Source</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
                <RadioGroup defaultValue="pdf" className="grid w-full grid-cols-4 gap-4">
                    <div>
                        <RadioGroupItem value="pdf" id="pdf" className="peer sr-only" />
                        <Label
                            htmlFor="pdf"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                         <FaFilePdf className="mb-3 h-6 w-6"/>   
                            PDF
                        </Label>
                    </div>
                    <div>
                        <RadioGroupItem value="website" id="website" className="peer sr-only" />
                        <Label
                            htmlFor="website"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                         <CgWebsite className="mb-3 h-6 w-6"/>   
                            Website
                        </Label>
                    </div>
                </RadioGroup>
            </div>

            <div>
                <div className="flex items-center py-4">
                    <Input
                        placeholder="Filter sources..."
                        value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
                        onChange={(event) =>
                            table.getColumn('name')?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />
                </div>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
                <div className="flex items-center justify-end space-x-2 py-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}