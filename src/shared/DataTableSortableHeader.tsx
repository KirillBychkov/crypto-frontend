import { Button } from '@/components/ui/button';
import { Column } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

type DataTableSortableHeaderProps<T> = {
  column: Column<T, unknown>;
  label: string;
};

export function DataTableSortableHeader<T>({
  column,
  label,
}: DataTableSortableHeaderProps<T>) {
  return (
    <Button
      className="px-0"
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    >
      {label}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
}
