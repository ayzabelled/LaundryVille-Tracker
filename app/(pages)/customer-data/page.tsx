"use client"

import { useEffect, useState } from 'react';
import { DataTable } from '../../components/tables/data-table';
import { customerColumns } from '../../components/tables/columns';

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
    <div>
      <h1>Customer Data</h1>
      <div className="container mx-auto py-10">
      <DataTable columns={customerColumns} data={data} />
      </div>
    </div>
  );
}
