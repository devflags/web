"use client"

import { ChevronLeft, ChevronRight, ChevronsUpDown, Search } from "lucide-react"
import { useMemo, useState } from "react"
import {
    useTable,
    type ColumnDef,
    type ColumnFiltersState,
    type RowData,
    type PaginationState,
    type SortingState,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { FeatureFlagType } from "@/lib/api/flags"

import { features, type DataTableFeatures } from "./data-table-features"

interface DataTableProps<TData extends RowData> {
    columns: ColumnDef<DataTableFeatures, TData>[]
    data: TData[]
    onRowClick?: (row: TData) => void
}

export function DataTable<TData extends RowData>({
    columns,
    data,
    onRowClick,
}: DataTableProps<TData>) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 5,
    })
    const [search, setSearch] = useState("")

    const searchedData = useMemo(() => {
        const query = search.trim().toLowerCase()
        if (!query) return data

        return data.filter((item) =>
            Object.values(item).some(
                (value) => typeof value === "string" && value.toLowerCase().includes(query),
            ),
        )
    }, [data, search])

    const table = useTable({
        features,
        data: searchedData,
        columns,
        state: { sorting, columnFilters, pagination },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onPaginationChange: setPagination,
    })

    return (
        <div className="space-y-4">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div className="relative w-full sm:max-w-sm">
                    <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={search}
                        onChange={(event) => {
                            setSearch(event.target.value)
                            table.setPageIndex(0)
                        }}
                        placeholder="Search flags..."
                        aria-label="Search flags"
                        className="pl-8"
                    />
                </div>
                <Select
                    value={(table.getColumn("type")?.getFilterValue() as string | undefined) ?? "ALL"}
                    onValueChange={(value) => {
                        table.getColumn("type")?.setFilterValue(value === "ALL" ? undefined : value)
                        table.setPageIndex(0)
                    }}
                >
                    <SelectTrigger className="w-full sm:w-40" aria-label="Filter by flag type">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All types</SelectItem>
                        {Object.values(FeatureFlagType).map((type) => (
                            <SelectItem key={type} value={type}>
                                {type.toLowerCase()}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder ? null : header.column.getCanSort() ? (
                                            (() => {
                                                const sortLabel = header.id === "flag" ? "flag name" : header.id
                                                const nextOrder = header.column.getNextSortingOrder()

                                                return (
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger
                                                        render={
                                                            <Button
                                                                variant="ghost"
                                                                className="-ml-2 h-8 px-2"
                                                                onClick={header.column.getToggleSortingHandler()}
                                                                aria-label={`Sort ${sortLabel} ${nextOrder ?? "unsorted"}`}
                                                            />
                                                        }
                                                    >
                                                        <table.FlexRender header={header} />
                                                        <ChevronsUpDown className="ml-1 size-3.5 text-muted-foreground" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        {header.column.getIsSorted()
                                                            ? `Sorted ${header.column.getIsSorted()}. Click for ${nextOrder ?? "no sorting"}`
                                                            : `Click to sort ${nextOrder ?? "ascending"}`}
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                                )
                                            })()
                                        ) : (
                                            <table.FlexRender header={header} />
                                        )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className={onRowClick ? "cursor-pointer" : undefined}
                                    onClick={() => onRowClick?.(row.original)}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            onClick={(event) => {
                                                if ((event.target as HTMLElement).closest("button")) {
                                                    event.stopPropagation()
                                                }
                                            }}
                                        >
                                            <table.FlexRender cell={cell} />
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

            <div className="flex flex-col justify-between gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center">
                <span>
                    Showing {table.getRowModel().rows.length} of {table.getFilteredRowModel().rows.length} flags
                </span>
                <div className="flex items-center gap-2">
                    <span>
                        Page {table.state.pagination.pageIndex + 1} of {Math.max(table.getPageCount(), 1)}
                    </span>
                    <Button
                        variant="outline"
                        size="icon-sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        aria-label="Previous page"
                    >
                        <ChevronLeft />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon-sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        aria-label="Next page"
                    >
                        <ChevronRight />
                    </Button>
                </div>
            </div>
        </div>
    )
}