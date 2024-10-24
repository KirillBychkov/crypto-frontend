import {useContext, useState} from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PlusCircleIcon } from "lucide-react";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useAxios } from "@/auth/axios-hook.ts";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/queryClient.ts";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToastContext } from "@/App.tsx";

const depositSchema = z.object({
  deposit: z.coerce.number(),
});

export function AddDepositModal() {
  const [open, setOpen] = useState(false);
  const [isDisabled, setDisabled] = useState(false);
  const { dairyService } = useAxios();
  const toast = useContext(ToastContext);

  const setDeposit = useMutation({
    mutationFn: (data) => dairyService?.put("deposit", { deposit: data.deposit }),
    onSuccess: (res)=> {
      queryClient.invalidateQueries({ queryKey: ["deposit"] });
      setOpen(false);
      setDisabled(false);
      toast.setToast({
          open: true,
          status: false,
          text: 'Deposit added successfully!'
      })
    },
    onError(e) {
      setOpen(false);
      setDisabled(false);
      toast.setToast({
          open: true,
          status: true,
          text: e.message || 'Failed to add the deposit!'
      })
    }
  });

  const form = useForm<z.infer<typeof depositSchema>>({
    resolver: zodResolver(depositSchema),
    defaultValues: { deposit: 0 },
  });

  function onSubmit(values: z.infer<typeof depositSchema>) {
    setDisabled(true);
    setDeposit.mutate({ deposit: values.deposit });
  }

  return (
    <Dialog onOpenChange={(open) => setOpen(open)} open={open}>
      <DialogTrigger asChild>
        <PlusCircleIcon className="cursor-pointer inline-block ml-3 mt-0 h-6 w-6 text-yellow-200"/>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Deposit</DialogTitle>
          <DialogDescription>
            Specify the amount of deposit you want to add to current balance
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 text-left">
            <FormField
                control={form.control}
                name="deposit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deposit</FormLabel>
                    <FormControl>
                      <Input id="field-add-deposit" type="number" placeholder="1000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
            />
            <Button type="submit" className="w-full" disabled={isDisabled}>
                {isDisabled? "Waiting...": "Add money to balance"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
