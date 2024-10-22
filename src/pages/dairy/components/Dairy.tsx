import { useQuery } from '@tanstack/react-query';
import { DataTable } from './DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { TradeGroupResponse } from '@/shared/common.ts';
import { useMemo, useState } from 'react';
import { AddTradeDialog } from './AddTradeDialog';
import { CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUpIcon, TrendingDownIcon } from 'lucide-react';
import { DataTableSortableHeader } from '@/shared/DataTableSortableHeader';
import { TradeFilters, filterTrades, initialFilters } from './TradesFilters';
import { useAxios } from "@/auth/axios-hook.ts";
import { useAuth } from "@/auth/auth-hook.ts";

const columns: ColumnDef<TradeGroupResponse>[] = [
  {
    accessorKey: 'avgEnter',
    header: ({ column }) => (
      <DataTableSortableHeader column={column} label="Enter Price" />
    ),
  },
  {
    accessorKey: 'ticker',
    header: ({ column }) => (
      <DataTableSortableHeader column={column} label="Ticker" />
    ),
  },
  {
    accessorKey: 'position',
    header: ({ column }) => (
      <DataTableSortableHeader column={column} label="Position" />
    ),
    cell: ({ row }) => (
      <Badge
        variant={
          row.getValue('position') === 'Long' ? 'positive' : 'destructive'
        }
      >
        {row.getValue('position')}
      </Badge>
    ),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
        <DataTableSortableHeader column={column} label="Status" />
    ),
    cell: ({ row }) => (
        <Badge
            variant={
              (row.getValue('status') === 'success' ? 'positive' : '') ||
              (row.getValue('status') === 'failed' ? 'destructive' : '') ||
              (row.getValue('status') === 'new' ? 'default' : '')
            }
        >
          {row.getValue('status')?.toUpperCase() || 'Unknown'}
        </Badge>
    ),
  },
  {
    accessorKey: 'trend',
    header: ({ column }) => (
      <DataTableSortableHeader column={column} label="Trend" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-start space-x-1">
        {row.getValue('trend') === 'Up' ? (
          <TrendingUpIcon className="h-4 w-4 text-green-500" />
        ) : (
          <TrendingDownIcon className="h-4 w-4 text-red-500" />
        )}
        <span>{row.getValue('trend')}</span>
      </div>
    ),
  },
  {
    accessorKey: 'order',
    header: ({ column }) => (
      <DataTableSortableHeader column={column} label="Order" />
    ),
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableSortableHeader column={column} label="Created at" />
    ),
    cell: ({ row }) => (
      <div>{new Date(row.getValue('createdAt')).toLocaleString('en-GB')}</div>
    ),
  },
  {
    accessorKey: 'id',
    header: '',
    cell: () => (
      <CollapsibleTrigger asChild>
        <Button variant="outline">Open Details</Button>
      </CollapsibleTrigger>
    ),
  },
];

export function Dairy() {
  const { dairyService } = useAxios();
  const { user } = useAuth();

  const [tradeFilters, setTradeFilters] = useState<TradeFilters>(initialFilters);
  const { data: _trades } = useQuery({
    queryKey: ['tradegroups', user?.id],
    queryFn: () => dairyService?.get("tradegroups"),
    enabled: !!user,
  });

  const { data: _deposit } = useQuery({
    queryKey: ['deposit', user?.id],
    queryFn: () => dairyService?.get("deposit"),
    enabled: !!user,
  });

  const deposit = useMemo(() => {
    return _deposit?.data?.data?.deposit ?? null;
  }, [_deposit]);

  const trades = useMemo(() => {
    return _trades?.data?.data ?? [];
  }, [_trades]);

  const filteredTrades = useMemo(
    () => filterTrades(trades, tradeFilters),
    [tradeFilters, trades]
  );

  const percentageThisMonth = useMemo(() => {
    const monthlyTrades = trades.filter((tr) =>
        new Date(tr.updatedAt).getMonth() === new Date().getMonth() && tr.result);

    return Math.round(monthlyTrades.reduce((acc, trade) => trade.result + acc, 0 ) * 100 / deposit);
  }, [trades, deposit]);

  const percentageThisDay = useMemo(() => {
    const dailyTrades = trades.filter((tr) =>
        new Date(tr.updatedAt).getDay() === new Date().getDay() && tr.result);

    return Math.round(dailyTrades.reduce((acc, trade) => trade.result + acc, 0) * 100 / deposit);
  }, [trades, deposit]);

  const isLocked = useMemo(() => {
    return -10 >= percentageThisMonth || -2 >= percentageThisDay;
  }, [trades]);

  return (
    <div className="container mx-auto py-10">
      <h1 className="scroll-m-20 text-left text-4xl font-extrabold tracking-tight lg:text-5xl">
        User's trades
      </h1>

      <div className="mt-8 flex w-full items-center justify-between">
        <TradeFilters
          tradeFilters={tradeFilters}
          changeTradeFilters={setTradeFilters}
        />
        <div style={{ minWidth:'400px' }} className={'flex items-center justify-between'}>
          <div>
            <abbr title={"10% per month or 2% per day will disable next button"}>
              <span className={'mr-4 '
                  + (percentageThisMonth > 0 ? 'text-green-500 ' : ' ')
                  + (percentageThisMonth < 0 ? 'text-red-500 ' : ' ')}>
                This month ~ {percentageThisMonth || 0} %
              </span><span className={'mr-4 '
                + (percentageThisDay > 0 ? 'text-green-500 ' : ' ')
                + (percentageThisDay < 0 ? 'text-red-500 ' : ' ')}>
                Today ~ {percentageThisDay || 0} %
              </span>
            </abbr>
          </div>
          {!!deposit && <AddTradeDialog isLocked={isLocked} />}
        </div>
      </div>
      <div className="mt-4">
        <DataTable columns={columns} data={filteredTrades} />
      </div>
    </div>
  );
}
