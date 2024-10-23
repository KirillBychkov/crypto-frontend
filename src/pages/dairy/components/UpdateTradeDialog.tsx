import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { queryClient } from '@/queryClient';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { PenIcon } from 'lucide-react';
import { useAxios } from "@/auth/axios-hook.ts";
import {ORDERS, TradeGroupResponse} from "@/shared/common.ts";
import {FormSelect} from "@/shared/FormSelect.tsx";

const updateTradeForm = z
    .object({
      enters: z
        .string()
        .regex(
            /^[0-9.]* \/ [0-9]{2,3}%*$/,
            'Fulfilled enters should be in format like "[value] / [percent]%"'
        ),
      stops: z
        .string()
        .regex(
            /^[0-9.]* \/ [0-9]{2,3}%*$/,
            'Fulfilled stops should be in format like "[value] / [percent]%"'
        ).optional(),
      takes: z
        .string()
        .regex(
            /^[0-9.]* \/ [0-9]{2,3}%*$/,
            'Fulfilled takes should be in format like "[value] / [percent]%"'
        ).optional(),
      price: z.coerce.number()
          .gt(0, 'Price should be greater than 0').optional(),
    })
    .superRefine(({
      enters,
      stops,
      takes,
      price
    }, refinementContext) => {
        if (enters.includes('100%') && stops && !price && !takes) return;
        if (enters.includes('100%') && !stops && !price && takes && takes.includes('100%')) return;
        if (enters.includes('100%') && !stops && price && takes && !takes.includes('100%')) return;
        if (enters.includes('100%') && !stops && price && !takes) return;

        if (!enters.includes('100%') && !stops && !price && takes && takes.includes('100%')) return;
        if (!enters.includes('100%') && !stops && price && takes && !takes.includes('100%')) return;
        if (!enters.includes('100%') && !stops && price && !takes) return;

        refinementContext.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Check available scenarios',
            path: ['takes'],
        });
    });

type UpdateTradeDialogProps = {
    trade: TradeGroupResponse;
    disabled: boolean;
};
type UpdateData = { price: number };

export function UpdateTradeDialog({
  trade,
  disabled,
}: UpdateTradeDialogProps) {
    const [open, setOpen] = useState(false);
    const [isDisable, setIsDisable] = useState(false);
    const { dairyService } = useAxios();

    const updateTrade = useMutation({
        mutationFn: (data: UpdateData) =>
            dairyService?.put("tradegroup/" + trade.id + "/close", data),
        onSuccess() {
            queryClient.invalidateQueries({queryKey: ['tradegroups'] });
            queryClient.invalidateQueries({ queryKey: ['user'] });
            queryClient.invalidateQueries({ queryKey: ['deposit'] });
            onOpenChange(false);
            setIsDisable(false);
        },
  });

  const form = useForm<z.infer<typeof updateTradeForm>>({
    resolver: zodResolver(updateTradeForm),
    defaultValues: {},
  });

  function onOpenChange(open: boolean) {
    setOpen(open);
    setIsDisable(false);
    if (!open) form.reset();
  }

  function onSubmit(values: z.infer<typeof updateTradeForm>) {
    setIsDisable(true);
    updateTrade.mutate({
        enters: values.enters,
        stops: values.stops,
        takes: values.takes,
        price: values.price
    });
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogTrigger asChild>
        <Button disabled={disabled} size="icon">
          <PenIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Close trade</DialogTitle>
            <DialogDescription>
                <span>Specify scenario. Choose enters at first and specify takes, stops or custom price for close order.</span><br/>
                <span>_________</span><br/>
                <span>1) Enters 100% + Stops</span><br/>
                <span>2) Enters 100% + Takes 100%</span><br/>
                <span>3) Enters 100% + Takes less 100% + Custom price</span><br/>
                <span>4) Enters 100% + No takes + Custom price</span><br/>
                <span>_________</span><br/>
                <span>5) Enters less 100% + Takes 100%</span><br/>
                <span>6) Enters less 100% + Takes less 100% + Custom price</span><br/>
                <span>7) Enters less 100% + No takes + Custom price</span><br/>
            </DialogDescription>
        </DialogHeader>
          <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 gap-4 md:grid-cols-2"
          >
            <FormSelect
                form={form}
                name="enters"
                label="Enter orders fullfilled"
                placeholder="Select enters"
                items={trade.enterTrades
                    .sort((a,b) => trade.position === 'Long'? +b.price - +a.price : +a.price - +b.price)
                    .map((e, i) => {
                      return e.price + ' / ' + Math.round(+e.percentage.replace('%', '') * (i + 1) + (trade.enterTrades.length === 2 && i === 2? 1 : 0) ) + '%'
                    })
                }
            />
            <FormSelect
                form={form}
                name="stops"
                label="Stop orders fullfilled"
                placeholder="Select stops"
                items={trade.stopTrades
                    .sort((a,b) => trade.position === 'Long'? +a.price - +b.price : +b.price - +a.price)
                    .map((e, i) => {
                      return e.price + ' / ' + Math.round(+e.percentage.replace('%', '') * (i + 1) + (trade.enterTrades.length === 2 && i === 2? 1 : 0) ) + '%'
                    })
                }
            />
            <FormSelect
                form={form}
                name="takes"
                label="Take orders fullfilled"
                placeholder="Select takes"
                items={trade.takeTrades
                    .sort((a,b) => trade.position === 'Long'? +a.price - +b.price : +b.price - +a.price)
                    .map((e, i) => {
                      let percentage = +e.percentage.replace('%', '');
                      if(i === 1) {
                          let prevPercentage = +trade.takeTrades[i - 1].percentage.replace('%', '');
                          percentage += Math.round(prevPercentage);
                      }
                      if(trade.takeTrades.length === i + 1) {
                          percentage = 100;
                      }

                      return e.price + ' / ' + percentage + '%';
                    })
                }
            />
            <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                    <FormItem>
                      <FormLabel>Custom price close</FormLabel>
                      <FormControl>
                        <Input placeholder="Price" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                )}
            />
            <Button disabled={isDisable} className="w-full md:col-span-2" type="submit">
                {isDisable? "Waiting..." : "Submit"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
