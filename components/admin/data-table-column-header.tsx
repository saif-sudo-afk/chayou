"use client";

import type { Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

type DataTableColumnHeaderProps<TData, TValue> = {
  column: Column<TData, TValue>;
  title: string;
};

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
}: DataTableColumnHeaderProps<TData, TValue>) {
  const sortState = column.getIsSorted();

  return (
    <Button
      className="-ml-3 h-8 px-3 text-xs uppercase tracking-[0.16em]"
      type="button"
      variant="ghost"
      onClick={() => column.toggleSorting(sortState === "asc")}
    >
      {title}
      {sortState === "desc" ? (
        <ArrowDown className="ml-2 h-3.5 w-3.5" />
      ) : sortState === "asc" ? (
        <ArrowUp className="ml-2 h-3.5 w-3.5" />
      ) : (
        <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
      )}
    </Button>
  );
}
