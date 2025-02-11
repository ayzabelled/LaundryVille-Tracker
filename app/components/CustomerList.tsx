"use client"

import React, { useEffect, useState } from 'react';
import { DataTable } from './tables/data-table';
import { listColumn } from './tables/columns';

const CustomerList: React.FC = () => {
  const [data, setData] = useState([]); // State to hold customer data


  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/laundry');
        const result = await response.json();
        console.log('Fetched data:', result); // Log the fetched data
        setData(result);
    };
    fetchData();
  }, []);

/* const handleCheckboxChange = (id: string) => {
    setCustomers((prevCustomers) =>
      prevCustomers.map((customer) =>
        customer.id === id ? { ...customer, received: !customer.received } : customer
      ).filter(customer => !customer.received) // Filter out received customers
    );
  }; */

  return (
    <div>
      <DataTable columns={listColumn} data={data} />
    </div>
  );
};

export default CustomerList;
