"use client"

import { useEffect, useState } from 'react';
import ReportsDashboard from '../components/ReportsDashboard';
import { DataTable } from '@/app/components/tables/data-table';
import { listColumn } from '@/app/components/tables/columns';

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
    <div>
      <div><ReportsDashboard /></div>
      <div>
        <DataTable columns={listColumn} data={data} onCheckboxChange={handleCheckboxChange} />
      </div>
    </div>
  );
}
