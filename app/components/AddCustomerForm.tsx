"use client"

import { useState, useEffect } from 'react';
import LaundryForm from './LaundryForm'; // Import the LaundryForm component

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

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/customers');
      if (!response.ok) {
        throw new Error('Failed to fetch customers');
      }
      const data: Customer[] = await response.json(); // Ensure the fetched data is typed
      setCustomers(data); // Set the fetched customers to state
    } catch (error) {
      console.error('Error fetching customers:', error);
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
      <form onSubmit={handleSubmit}>
        {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>} {/* Display success message */}

        <div>
          <label>
            <input
              type="radio"
              value="new"
              checked={isNewCustomer}
              onChange={() => setIsNewCustomer(true)}
            />
            Add New Customer
          </label>
          <label>
            <input
              type="radio"
              value="existing"
              checked={!isNewCustomer}
              onChange={() => setIsNewCustomer(false)}
            />
            Select Existing Customer
          </label>
        </div>
        {isNewCustomer ? (
          <>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <label htmlFor="number">Number:</label>
            <input
              type="text"
              id="number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              required
            />
          </>
        ) : (
          <select onChange={(e) => handleCustomerSelect(Number(e.target.value))} value={selectedCustomerId || ''}>
            <option value="" disabled>Select an existing customer</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>
        )}

        <button type="submit">{isNewCustomer ? 'Add Customer' : 'Select Customer'}</button>
      </form>

      {showLaundryForm && selectedCustomerId && (
        <LaundryForm customerId={selectedCustomerId} /> // Render LaundryForm with selected customer ID
      )}
    </>
  );
};

export default AddCustomerForm;
