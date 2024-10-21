import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { FieldValues, Path, UseFormReturn } from 'react-hook-form';

type FormSelectProps<T extends FieldValues, TItems> = {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  disabled: boolean;
  placeholder: string;
  items: TItems;
};

export function FormSelect<
  T extends FieldValues,
  TItems extends readonly any[],
>(props: FormSelectProps<T, TItems>) {
  return (
    <FormField
      control={props.form.control}
      name={props.name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{props.label}</FormLabel>
          <FormControl>
            <Select
              onValueChange={field.onChange}
              value={field.value}
              defaultValue={field.value}
              disabled={props.disabled}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={props.placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {props.items.map((item) => {
                  return <SelectItem key={item} value={String(item)}>
                    {item}
                  </SelectItem>
                })}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
