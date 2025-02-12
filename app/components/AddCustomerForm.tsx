"use client"

import { useState, useEffect } from 'react';
import LaundryForm from './LaundryForm'; // Import the LaundryForm component
import { Input } from '@/components/ui/input'; // Corrected import statement
import { Button } from '@/components/ui/button'; // Corrected import statement

interface Customer {
  id: number;
  name: string;
}

const AddCustomerForm: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]); // State to hold the list of existing customers
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null); // State to hold the selected customer ID
  const [showLaundryForm, setShowLaundryForm] = useState(false); // State to control visibility of LaundryForm
  const [isNewCustomer, setIsNewCustomer] = useState(true); // State to track if adding a new customer
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // Loading state

  const fetchCustomers = async () => {
    setLoading(true); // Set loading to true when fetching starts
    try {
      const response = await fetch('/api/customers');
      if (!response.ok) {
        throw new Error('Failed to fetch customers');
      }
      const data: Customer[] = await response.json(); // Ensure the fetched data is typed
      setCustomers(data); // Set the fetched customers to state
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false); // Set loading to false when fetching ends
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear any previous errors
    setSuccessMessage(null); // Clear any previous success message

    if (isNewCustomer) {
      if (!name || !number) {
        setError("Name and number are required.");
        return;
      }

      setLoading(true); // Set loading to true when creating a new customer
      try {
        const response = await fetch('/api/customers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, number }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create customer');
        }

        const newCustomer = await response.json();
        console.log('New customer created:', newCustomer);

        setName(''); // Clear the form fields
        setNumber('');
        setSuccessMessage("Customer created successfully!");

      } catch (error) {
        console.error('Error creating customer:', error);
        setError((error as Error).message); // Set the error message to display
      } finally {
        setLoading(false); // Set loading to false when creation ends
      }
    } else {
      if (selectedCustomerId) {
        setShowLaundryForm(true); // Show the LaundryForm when a customer is selected
      } else {
        setError("Please select an existing customer.");
      }
    }
  };

  const handleCustomerSelect = (customerId: number) => {
    setSelectedCustomerId(customerId);
    setShowLaundryForm(true); // Show the LaundryForm when a customer is selected
  };

  useEffect(() => {
    if (!isNewCustomer) {
      fetchCustomers(); // Fetch customers when switching to existing customer
    }
  }, [isNewCustomer]);

  return (
    <>
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
      <form onSubmit={handleSubmit}>
        {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>} {/* Display success message */}

        <div className='flex flex-row gap-2 justify-center p-2'>
          <label className='font-bold text-base'>
            <input
              type="radio"
              value="new"
              checked={isNewCustomer}
              onChange={() => setIsNewCustomer(true)}
            />
            Add
          </label>
          <label className='font-bold text-base'>
            <input
              type="radio"
              value="existing"
              checked={!isNewCustomer}
              onChange={() => setIsNewCustomer(false)}
            />
            Select Existing
          </label>
        </div>
        {isNewCustomer ? (
          <>
            <label htmlFor="name">Name:</label>
            <Input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <label htmlFor="number">Number:</label>
            <Input
              type="number"
              id="number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              className='[&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden'
              required
            />
            <div className='pt-4 flex justify-center'>
              <Button type="submit">Add Customer</Button>
            </div>
          </>
        ) : (
          <select className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden' onChange={(e) => handleCustomerSelect(Number(e.target.value))} value={selectedCustomerId || ''}>
            <option value="" disabled>Select an existing customer</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>
        )}
      </form>

      {showLaundryForm && selectedCustomerId && !isNewCustomer && (

        <LaundryForm customerId={selectedCustomerId} /> // Render LaundryForm with selected customer ID
      )}
    </>
  );
};

export default AddCustomerForm;
