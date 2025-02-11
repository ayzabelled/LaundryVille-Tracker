"use client"

import AddCustomerForm from '@/app/components/AddCustomerForm';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();

  return (
    <div className='p-4 w-screen'>
      <header className='flex justify-center'>
        <Image src="/logo.png"
          width={200}
          height={200}
          className="flex justify-center"
          alt="LaundryVille LaundryStation Logo" />
      </header>
      <h1 className='text-2xl font-bold text-[#0066CC] pt-2'>New Entry</h1>
      <AddCustomerForm></AddCustomerForm>
    </div>
  );
}
