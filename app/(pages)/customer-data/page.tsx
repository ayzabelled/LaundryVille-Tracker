"use client"

import { useEffect, useState } from 'react';
import { DataTable } from '../../components/tables/data-table';
import { customerColumns } from '../../components/tables/columns';
import Image
 from 'next/image';
export default function CustomerData() {
  const [data, setData] = useState([]);
  const handleOpenLaundryItems = (customerId: string) => {

    // Logic to open laundry items for the customer
    console.log(`Opening laundry items for customer ID: ${customerId}`);
    // You can navigate to another page or open a modal here
  };


  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/customers');
      const result = await response.json();
      setData(result);
    };
    fetchData();
  }, []);

  return (
    <div className='p-4 w-screen'>
      <header className='flex justify-center'>
        <Image src="/logo.png"
          width={200}
          height={200}
          className="flex justify-center"
          alt="LaundryVille LaundryStation Logo" />
      </header>
      <h1 className='text-2xl font-bold text-[#0066CC] pt-2'>Customer Data</h1>
      <div>
      <DataTable columns={customerColumns} data={data} />
      </div>
    </div>
  );
}
