"use client"

import { useEffect, useState } from 'react';
import { DataTable } from '../../components/tables/data-table';
import { customerColumns } from '../../components/tables/columns';
import Image
 from 'next/image';
export default function CustomerData() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  const handleOpenLaundryItems = (customerId: string) => {

    // Logic to open laundry items for the customer
    console.log(`Opening laundry items for customer ID: ${customerId}`);
    // You can navigate to another page or open a modal here
  };


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
      const response = await fetch('/api/customers');
      const result = await response.json();
      setData(result);
    } catch (error) {
      setError((error as Error).message); // Set the error message to display
    } finally {
      setLoading(false); // Set loading to false when fetching ends
    }
  };
  fetchData();
}, []);
  

  return (
    <div className='p-4'>
      {loading && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <svg
            className="animate-spin size-10 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v2a6 6 0 100 12v2a8 8 0 01-8-8z" />
          </svg>
        </div>
      )}
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
