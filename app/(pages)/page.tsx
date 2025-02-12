"use client"

import { useEffect, useState } from 'react';
import ReportsDashboard from '../components/ReportsDashboard';
import { DataTable } from '@/app/components/tables/data-table'; // Corrected import statement
import { listColumn } from '@/app/components/tables/columns'; // Corrected import statement
import Image from 'next/image';

export default function Dashboard() {
  const [data, setData] = useState([]); // State to hold customer data
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  const handleCheckboxChange = async (id: string) => {
    try {
      const response = await fetch(`/api/laundry`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, received: true }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update received status');
      }
  
      const updatedCustomer = await response.json();
      // Refresh the page after successful update
      window.location.reload();

    } catch (error) {
      console.error('Error updating received status:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Set loading to true when fetching starts
      try {
        const response = await fetch('/api/laundry');
        if (!response.ok) {
          throw new Error('Failed to fetch customer data');
        }
        const result = await response.json();        
        setData(result.filter((item: { received: boolean }) => !item.received));
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
      <h1 className='text-2xl font-bold text-[#0066CC] pt-2'>Earnings Reports</h1>
      <div className='pt-2 pb-2'><ReportsDashboard /></div>
      <h2 className='text-2xl font-bold text-[#0066CC] pb-2'>For Pick Up</h2>
      <div>
        <DataTable columns={listColumn} data={data} onCheckboxChange={handleCheckboxChange} />
      </div>
    </div>
  );
}
