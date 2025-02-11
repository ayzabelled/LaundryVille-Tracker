"use client"

import { LoginForm } from "@/components/login-form"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image
  from "next/image";
export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = !!document.cookie.split('; ').find(row => row.startsWith('token='));
    if (isLoggedIn) {
      router.push('/');
    }
  }, [router]);


  return (
    <div className="flex flex-col items-center p-4">
    <Image src="/logo.png"
      width={300}
      height={300}
      className="p-4"
      alt="LaundryVille LaundryStation Logo" />
    <div className="flex w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
      </div>
    </div>
  )
}
