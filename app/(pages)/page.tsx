"use client"

import { useEffect, useState } from 'react';
import ReportsDashboard from '../components/ReportsDashboard';
import { DataTable } from '@/app/components/tables/data-table';
import { listColumn } from '@/app/components/tables/columns';
import Image
 from 'next/image';
export default function Dashboard() {
  const [data, setData] = useState([]); // State to hold customer data

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
      const response = await fetch('/api/laundry');
      const result = await response.json();
      console.log('Fetched data:', result); // Log the fetched data
      // Filter data to only include items where received is false
      setData(result.filter((item: { received: boolean }) => !item.received));
    };
    fetchData();
  }, []);
  
  return (
    <div className='p-4 h-screen w-screen'>
      <header className='flex justify-center'>
       <Image src="/logo.png"
            width={200}
            height={200}
            className="flex justify-center"
            alt="LaundryVille LaundryStation Logo" />
            </header>
      <h1 className='text-2xl font-bold text-[#0066CC] pt-2'>Earnings Reports</h1>
      <div className='pt-4 pb-4'><ReportsDashboard /></div>
      <div>
        <DataTable columns={listColumn} data={data} onCheckboxChange={handleCheckboxChange} />
      </div>
    </div>
  );
}
