import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { queryClient } from '@/queryClient';
import { useMutation } from '@tanstack/react-query';
import { useState, MouseEvent } from 'react';
import { TrashIcon } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { useAxios } from "@/auth/axios-hook.ts";

const omitConfirmKey = 'omitDeleteModal';

type DeleteTradeDialogProps = { tradeId: string, disabled: boolean };

export function DeleteTradeDialog({ tradeId, disabled }: DeleteTradeDialogProps) {
  const { dairyService } = useAxios();
  const [open, setOpen] = useState(false);
  const [omit, setOmit] = useState(false);
  const [isDisable, setIsDisable] = useState(false);

  const deleteTrade = useMutation({
    mutationFn: (id: string) => dairyService?.delete("tradegroup/" + id),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['tradegroups'] });
      setOpen(false);
      setIsDisable(false);
      if (omit) localStorage.setItem(omitConfirmKey, 'true');
      // TODO: Show toast
    },
  });

  const onCancel = () => {
    setIsDisable(false);
    setOpen(false);
  };
  const onConfirm = () => {
    setIsDisable(true);
    deleteTrade.mutate(tradeId);
  };
  const onDeleteClick = (e: MouseEvent) => {
    const shouldOmitDeleteModal = localStorage.getItem(omitConfirmKey) === 'true';
    if (!shouldOmitDeleteModal) return;
    e.preventDefault();
    onConfirm();
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button disabled={disabled} onClick={onDeleteClick} size="icon" variant="destructive">
          <TrashIcon />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete trade
            from database.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={omit}
            onCheckedChange={(val) => setOmit(!!val)}
            id="omit"
          />
          <label
            htmlFor="omit"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Don't show this modal again
          </label>
        </div>

        <div className="flex gap-4">
          <Button className="w-full" onClick={onCancel} variant="secondary">
            Cancel
          </Button>
          <Button className="w-full" onClick={onConfirm} disabled={isDisable} variant="destructive">
            {isDisable? "Waiting..." : "Delete"}
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
