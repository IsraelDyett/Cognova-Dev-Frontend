"use client";
import { z } from 'zod'
import React from 'react'
import { toast } from 'sonner';
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import {
    Form,
    FormAction,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import Link from 'next/link';
import { getMessage } from '@/lib/lang';
import { signUpSchema } from '@/lib/zod';
import { signUpAction } from '../actions';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SignUpForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    })

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        const result = await signUpAction(data);
        if (result.success) {
            toast.success(getMessage(result.message));
            document.cookie = `session.token=${result.data?.sessionToken}; expires=${result.data?.expiresAt}; path=/;`;
            router.push(searchParams.get('back') ?? '/')
        } else {
            console.error(result.message)
            toast.error(getMessage(result.message))
        }
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter your email" {...field} type="email" autoCapitalize="none" autoComplete="email" autoCorrect="off" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input placeholder="Create a password" {...field} type="password" autoComplete="new-password" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormAction>
                    Create account
                </FormAction>
                <p className="text-end text-sm mt-2">
                    Already have an account?{' '}
                    <Link href={`/auth/sign-in?back=${searchParams.get('back') ?? '/'}`} className="font-semibold">
                        Sign in
                    </Link>
                </p>
            </form>
        </Form>
    )
}
