"use client"

import { LoginForm } from "@/components/login-form"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = !!document.cookie.split('; ').find(row => row.startsWith('token='));
    if (isLoggedIn) {
      router.push('/');
    }
  }, [router]);

  
  return (  

    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  )
}
