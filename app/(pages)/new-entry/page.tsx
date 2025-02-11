"use client"

import AddCustomerForm from '@/app/components/AddCustomerForm';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div>
      <AddCustomerForm></AddCustomerForm>
    </div>
  );
}
