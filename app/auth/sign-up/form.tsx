"use client";
import { z } from 'zod'
import React, { useEffect, useRef } from 'react'
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
import { SignUpSchema } from '@/lib/zod';
import { signUpAction } from '../actions';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRightIcon } from 'lucide-react';

export default function SignUpForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const form = useForm<z.infer<typeof SignUpSchema>>({
        resolver: zodResolver(SignUpSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    })
    
    const submitButtonRef = useRef<HTMLButtonElement>(null);
    const onSubmit = async (data: z.infer<typeof SignUpSchema>) => {
        const result = await signUpAction(data);
        if (result.success) {
            toast.success(getMessage(result.message));
            router.push(searchParams.get('redirect') ?? '/')
        } else {
            console.error(result.message)
            form.setError('email', {
                type: 'custom',
                message: getMessage(result.message),
            });
        }
    }
    useEffect(() => {
        if (submitButtonRef.current && submitButtonRef.current.disabled) {
            submitButtonRef.current.disabled = false;
        }
    }, []);
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4' noValidate>
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input {...field} type="email" autoCapitalize="none" autoComplete="email" autoCorrect="off" />
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
                                <Input {...field} showPasswordToggle type="password" autoComplete="new-password" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className='mt-4'>
                    <FormAction disabled ref={submitButtonRef} className='[&>div>svg]:!size-5' variant="expandIcon" Icon={ArrowRightIcon} iconPlacement="right">
                        Create account
                    </FormAction>
                </div>
                <p className="text-end text-sm mt-2">
                    Already have an account?{' '}
                    <Link href={`/auth/sign-in?redirect=${searchParams.get('redirect') ?? '/'}`} className="font-semibold">
                        Sign in
                    </Link>
                </p>
            </form>
        </Form>
    )
}
