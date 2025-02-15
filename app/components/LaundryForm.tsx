"use client"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';

interface LaundryFormProps {
  customerId: number;
}

const LaundryForm: React.FC<LaundryFormProps> = ({ customerId }) => {
  const [amount, setAmount] = useState(1); // Default value set to 1
  const [detergentExtras, setDetergentExtras] = useState(0); // Number of extra detergents
  const [totalPrice, setTotalPrice] = useState(0);
  const [received] = useState(false); // Automatically set to false
  const [createdAt] = useState(new Date()); // Capture the current date
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when submitting
    setError(null); // Clear any previous errors
    setSuccessMessage(null); // Clear any previous success message

    const extras = { detergentExtras }; // Store the number of extra detergents

    try {
      const response = await fetch('/api/laundry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId,
          amountOfLaundry: amount,
          extras,
          totalPrice,
          createdAt,
          received,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create laundry item');
      }

      console.log('Laundry item created!');
      setAmount(1); // Reset to default value
      setDetergentExtras(0);
      setTotalPrice(130);
      setSuccessMessage("Laundry entry created successfully!");
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false); // Set loading to false when submission ends
    }
  };

  useEffect(() => {
    let price = amount * 130; // Base price set to 130 PHP
    price += detergentExtras * 15; // Add cost of extra detergents
    setTotalPrice(price);
  }, [amount, detergentExtras]);

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
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>} {/* Display success message */}
      <form onSubmit={handleSubmit}>
        <label htmlFor="amount" className='pt-4'>Amount of Laundry:</label>
        <Input
          type="number"
          id="amount"
          value={amount}
          className='[&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden'
          onChange={(e) => setAmount(Number(e.target.value))}
          required
          min="1" // Prevent <1 value
        />

        <label htmlFor="detergentExtras">Extra Detergents:</label>
        <Input
          type="number"
          id="detergentExtras"
          value={detergentExtras}
          className='[&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden'
          onChange={(e) => setDetergentExtras(Number(e.target.value))}
          min="0" // Prevent negative detergent extras
        />
        <p>Total Price: <span className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm'>₱{totalPrice.toFixed(2)}</span></p>
        <div className='flex justify-center p-4'>
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </>
  );
};

export default LaundryForm;
