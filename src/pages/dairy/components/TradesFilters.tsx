import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { DateRangePicker } from '@/shared/DateRangePicker';
import { FormSelect } from '@/shared/FormSelect';
import { MultiSelect } from '@/shared/MultiSelect';
import { optionsFromTuple } from '@/utils/optionsFromTuple';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ORDERS,
  Orders,
  POSITIONS,
  Positions,
  RISKS,
  Risks,
  TICKERS,
  TRENDS,
  Tickers,
  TradeGroupResponse,
  Trends,
} from '@/shared/common.ts';
import { isAfter, isBefore } from 'date-fns';
import { FilterIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { z } from 'zod';

const _RISKS = RISKS.map((risk) => String(risk)) as [
  `${Risks}`,
  ...`${Risks}`[],
];

function toQueryParams(data: TradeFilters): string {
  const params = new URLSearchParams();

  if (data.createdAt) {
    params.append('createdAt.from', data.createdAt.from.toISOString());
    if (data.createdAt.to) {
      params.append('createdAt.to', data.createdAt.to.toISOString());
    }
  }

  if (data.ticker) params.append('ticker', data.ticker);
  if (data.position) params.append('position', data.position);
  if (data.trend) params.append('trend', data.trend);
  if (data.order) params.append('order', data.order);

  if (data.risks.length > 0) {
    data.risks.forEach((risk) => params.append('risks', risk.toString()));
  }

  return params.toString();
}

function fromQueryParams(params: URLSearchParams): TradeFilters {
  const data: any = {};

  const dateFrom = params.get('createdAt.from');
  const dateTo = params.get('createdAt.to');

  if (dateFrom) {
    data.createdAt = { from: new Date(dateFrom) };
    if (dateTo) {
      data.createdAt.to = new Date(dateTo);
    }
  }

  const ticker = params.get('ticker');
  if (ticker) data.ticker = ticker as Tickers;

  const position = params.get('position');
  if (position) data.position = position as Positions;

  const trend = params.get('trend');
  if (trend) data.trend = trend as Trends;

  const order = params.get('order');
  if (order) data.order = order as Orders;

  const risks = params.getAll('risks');
  if (risks.length > 0) data.risks = risks as `${Risks}`[];

  return filterSchema.parse(data);
}

export const initialFilters: TradeFilters = {
  createdAt: undefined,
  ticker: undefined,
  position: undefined,
  trend: undefined,
  order: undefined,
  risks: [],
};

const filterSchema = z.object({
  createdAt: z
    .object({
      from: z.date(),
      to: z.date().optional(),
    })
    .optional(),
  ticker: z.enum(TICKERS).optional(),
  position: z.enum(POSITIONS).optional(),
  trend: z.enum(TRENDS).optional(),
  order: z.enum(ORDERS).optional(),
  risks: z.array(z.enum(_RISKS)).default([]),
});

export const filterTrades = (
  trades: TradeGroupResponse[],
  tradeFilters: TradeFilters
) =>
  trades.filter(
    (trade) =>
      (!tradeFilters.ticker || trade.ticker === tradeFilters.ticker) &&
      (!tradeFilters.position || trade.position === tradeFilters.position) &&
      (!tradeFilters.order || trade.order === tradeFilters.order) &&
      (!tradeFilters.trend || trade.trend === tradeFilters.trend) &&
      (!tradeFilters.risks.length ||
        tradeFilters.risks.includes(String(trade.riskPercent) as `${Risks}`)) &&
      (!tradeFilters.createdAt?.from ||
        isAfter(trade.createdAt, tradeFilters.createdAt.from)) &&
      (!tradeFilters.createdAt?.to ||
        isBefore(trade.createdAt, tradeFilters.createdAt.to))
  );

export type TradeFilters = z.infer<typeof filterSchema>;

type TradeFiltersProps = {
  tradeFilters: TradeFilters;
  changeTradeFilters: (values: TradeFilters) => void;
};
export function TradeFilters({
  tradeFilters,
  changeTradeFilters,
}: TradeFiltersProps) {
  const [open, setOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const form = useForm<TradeFilters>({
    resolver: zodResolver(filterSchema),
    defaultValues: initialFilters,
  });

  function onSubmit(values: TradeFilters) {
    changeTradeFilters(values);
  }

  function onReset() {
    changeTradeFilters(initialFilters);
    setSearchParams({});
    setOpen(false);
    setTimeout(() => form.reset(), 200);
  }

  useEffect(() => {
    if (tradeFilters === initialFilters) {
      return;
    }
    const params = toQueryParams(tradeFilters);
    setSearchParams(params);
  }, [tradeFilters]);

  useEffect(() => {
    if (tradeFilters !== initialFilters) {
      return;
    }
    const formattedParams = fromQueryParams(searchParams);
    changeTradeFilters(formattedParams);
    form.reset(formattedParams);
  }, [searchParams, tradeFilters]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-44">
          <FilterIcon className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </PopoverTrigger>
      <PopoverContent className="min-w-96">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Filters</h4>
            <p className="text-sm text-muted-foreground">
              Adjust the filters to narrow down the trades.
            </p>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid grid-cols-1 gap-2 md:grid-cols-2"
            >
              <FormSelect
                form={form}
                name="ticker"
                label="Ticker"
                placeholder="Select ticker"
                items={TICKERS}
              />
              <FormSelect
                form={form}
                name="position"
                label="Position"
                placeholder="Select position"
                items={POSITIONS}
              />
              <FormSelect
                form={form}
                name="trend"
                label="Trend"
                placeholder="Select trend"
                items={TRENDS}
              />
              <FormSelect
                form={form}
                name="order"
                label="Order"
                placeholder="Select order"
                items={ORDERS}
              />
              <FormField
                control={form.control}
                name="risks"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Risks</FormLabel>
                    <FormControl>
                      <MultiSelect
                        selected={field.value}
                        options={optionsFromTuple<Risks>(RISKS)}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="createdAt"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Date of creation</FormLabel>
                    <FormControl>
                      <DateRangePicker
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Apply filters</Button>
              <Button variant="secondary" type="button" onClick={onReset}>
                Clear filters
              </Button>
            </form>
          </Form>
        </div>
      </PopoverContent>
    </Popover>
  );
}
