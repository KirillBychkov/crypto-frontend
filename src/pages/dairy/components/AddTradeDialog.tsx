import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { numberEnum } from '@/utils/numberEnum';
import {
  ORDERS,
  POSITIONS,
  RISKS,
  TICKERS,
  TRENDS,
  TradeGroupRequest,
} from '@/shared/common.ts';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { FormSelect } from '@/shared/FormSelect';
import { Input } from '@/components/ui/input';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@/queryClient';
import { useState } from 'react';
import { useAxios } from "@/auth/axios-hook.ts";

const addTradeSchema = z
  .object({
    ticker: z.enum(TICKERS),
    position: z.enum(POSITIONS),
    trend: z.enum(TRENDS),
    order: z.enum(ORDERS),
    avgEnter: z.coerce.number().gt(0, 'Enter value should be greater than 0'),
    enterCount: z.coerce
      .number()
      .gt(0, 'Trade group should have at least on enter order'),
    stop: z.coerce.number().gt(0, 'Stop value should be greater than 0'),
    // SHOULD BE REQUIRED
    firstTakePrice: z
      .string()
      .regex(
        /^[0-9]* \/ [0-9]{2,3}%*$/,
        'Take price should be in format like "[value] / [percent]%"'
      ),
    secondTakePrice: z
      .string()
      .regex(/^[0-9]* \/ [0-9]{2,3}%*$/)
      .optional(),
    thirdTakePrice: z
      .string()
      .regex(/^[0-9]* \/ [0-9]{2,3}%*$/)
      .optional(),
    riskPercent: z.coerce.number().superRefine(numberEnum(RISKS)),
  })
  .superRefine(({
    avgEnter,
    stop,
    position
  }, refinementContext) => {
    if (!position) {
      return;
    }
    if (position === 'Long') {
      if (stop >= avgEnter) {
        refinementContext.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Stop price should be less than enter',
          path: ['stop'],
        });
      }
      return;
    }

    if (stop <= avgEnter) {
      refinementContext.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Stop price should be greater than enter',
        path: ['stop'],
      });
    }
  })
  .superRefine(({
    firstTakePrice,
    secondTakePrice,
    thirdTakePrice
  }, refinementContext) => {
    let res = 0;
    const [price1, percentage1] = firstTakePrice.split(' / ');
    const [price2, percentage2] = secondTakePrice? secondTakePrice.split(' / ') : [];
    const [price3, percentage3] = thirdTakePrice? thirdTakePrice.split(' / ') : [];
    if(price1) res += +percentage1.replace('%', '');
    if(price2) res += +percentage2.replace('%', '');
    if(price3) res += +percentage3.replace('%', '');

    if(res !== 100) {
        refinementContext.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Takes together must be 100 percentage',
            path: ['firstTakePrice'],
        });

        refinementContext.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Takes together must be 100 percentage',
            path: ['secondTakePrice'],
        });

        refinementContext.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Takes together must be 100 percentage',
            path: ['thirdTakePrice'],
        });
    }
  })
  .superRefine(({
   order,
   enterCount
  }, refinementContext) => {
        if (!order) return;
        if (order === 'Market') {
            if (enterCount !== 1) {
                refinementContext.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Enters count in market order must be 1',
                    path: ['enterCount'],
                });
            }
            return;
        }
    });

type AddTradeDialogProps = { isLocked: boolean };

export function AddTradeDialog({ isLocked }: AddTradeDialogProps) {
  const { dairyService } = useAxios();
  const [open, setOpen] = useState(false);
  const [isDisable, setIsDisable] = useState(false);

  const addTrade = useMutation({
    mutationFn: (data: TradeGroupRequest) => dairyService?.post("tradegroup", data),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['tradegroups'] });
      onOpenChange(false);
      setIsDisable(false);
      // TODO: Show toast
    },
  });
  const form = useForm<z.infer<typeof addTradeSchema>>({
    resolver: zodResolver(addTradeSchema),
    defaultValues: {},
  });

  function onOpenChange(open: boolean) {
    setIsDisable(false);
    setOpen(open);
    if (!open) {
      form.reset();
    }
  }

  function onSubmit(values: z.infer<typeof addTradeSchema>) {
    setIsDisable(true);
    addTrade.mutate(values);
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogTrigger asChild>
        <Button disabled={isLocked}>Add new trade</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add trade</DialogTitle>
          <DialogDescription>
            Specify details for the new trade. Risk will be calculated from the deposit balance in the moment of creation.
            <br /><span className={"text-red-500"}>If you change your deposit manually pay attention of it!!</span>
          </DialogDescription>
        </DialogHeader>
        {/* TODO: Move to separate component */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 gap-4 md:grid-cols-2"
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
              label="Orders"
              placeholder="Select order"
              items={ORDERS}
            />
            <FormSelect
              form={form}
              name="riskPercent"
              label="Risc percent"
              placeholder="Select risk percent"
              items={RISKS}
            />
            <FormField
              control={form.control}
              name="avgEnter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter price</FormLabel>
                  <FormControl>
                    <Input placeholder="Trade's enter price" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormSelect
              form={form}
              name="enterCount"
              label={"Enter's count for Limit"}
              placeholder="Select trades count"
              items={[1, 2, 3, 4]}
            />
            <FormField
              control={form.control}
              name="stop"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stop price</FormLabel>
                  <FormControl>
                    <Input placeholder="Trade's stop price" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="firstTakePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First take</FormLabel>
                  <FormControl>
                    <Input placeholder="First take price" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="secondTakePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Second take</FormLabel>
                  <FormControl>
                    <Input placeholder="Second take price" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="thirdTakePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Third take</FormLabel>
                  <FormControl>
                    <Input placeholder="Third take price" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full md:col-span-2" type="submit" disabled={isDisable}>
                {isDisable? 'Waiting...' : 'Submit'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
