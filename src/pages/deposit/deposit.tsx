import { Button } from '@/components/ui/button';
import { Navigate } from 'react-router-dom';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {useMutation, useQuery} from '@tanstack/react-query';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { useAxios } from "@/auth/axios-hook.ts";
import { useMemo } from "react";
import { useAuth } from "@/auth/auth-hook.ts";

const depositSchema = z.object({
    deposit: z.coerce.number().gt(0, 'Deposit should be greater than 0'),
});

export function Deposit() {
    const { dairyService } = useAxios();
    const { user } = useAuth();

    const setDeposit = useMutation({
        mutationFn: (data) => dairyService?.post("deposit", { deposit: data.deposit }),
        onSuccess: () => location.href = '/'
    });

    const { data: _deposit } = useQuery({
        queryKey: ['deposit', user?.id],
        queryFn: () => dairyService?.get("deposit"),
        enabled: !!user,
    });

    const deposit = useMemo(() => {
        return _deposit?.data?.data?.deposit ?? null;
    }, [_deposit]);

    const form = useForm<z.infer<typeof depositSchema>>({
        resolver: zodResolver(depositSchema),
        defaultValues: { deposit: 0 },
    });
    function onSubmit(values: z.infer<typeof depositSchema>) {
        setDeposit.mutate({ deposit: values.deposit });
    }

    if (deposit) {
        return <Navigate to='/dairy' />
    }

    return (
        <div className="flex min-h-lvh items-center justify-center">
            <Card className="mx-auto max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Deposit form</CardTitle>
                    <CardDescription>
                        Enter your deposit below to attach it to your account. You cant change it during trading
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 text-left">
                                <FormField
                                    control={form.control}
                                    name="deposit"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Deposit</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="1000" {...field} />
                                                </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full">
                                    Submit deposit
                                </Button>
                            </form>
                        </Form>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
