'use client';
import { signOut } from '../actions';
import React, { useEffect } from 'react';
import LoadingDots from '@/components/ui/loading-dots';

export default function SignOutPage() {
  useEffect(() => {
    setTimeout(() => {
      signOut();
    }, 2000);
  }, []);
  return (
    <div className="flex fixed flex-col items-center justify-center h-screen bg-white inset-0">
      <div className="flex items-end space-x-2">
        <p className="text-base font-medium pr-2 translate-y-1.5">Logging out</p>
        <LoadingDots/>
      </div>
    </div>
  );
}
