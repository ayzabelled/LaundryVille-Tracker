// components/LaundryForm.tsx
"use client"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';

interface LaundryFormProps {
  customerId: number;
}

const LaundryForm: React.FC<LaundryFormProps> = ({ customerId }) => {
  const [amount, setAmount] = useState(0); // Default value set to 0
  const [detergentExtras, setDetergentExtras] = useState(0); // Number of extra detergents
  const [totalPrice, setTotalPrice] = useState(0);
  const [received] = useState(false); // Automatically set to false
  const [createdAt, setCreatedAt] = useState(new Date()); // Capture the current date

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      setAmount(0); // Reset to default value
      setDetergentExtras(0);
      setTotalPrice(0);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    let price = amount * 150; // Base price set to 150 PHP
    price += detergentExtras * 15; // Add cost of extra detergents
    setTotalPrice(price);
  }, [amount, detergentExtras]);

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="amount" className='pt-4'>Amount of Laundry:</label>
      <Input
        type="number"
        id="amount"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))} // Ensure it's a number
        required
        min="0" // Prevent negative values
      />

      <label htmlFor="detergentExtras">Extra Detergents:</label>
      <Input
        type="number"
        id="detergentExtras"
        value={detergentExtras}
        onChange={(e) => setDetergentExtras(Number(e.target.value))} // Ensure it's a number
        min="0" // Prevent negative detergent extras
      />
      <p>Total Price: <span className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm'>₱{totalPrice.toFixed(2)}</span></p>
      <div className='flex justify-center p-4'>
        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
};

export default LaundryForm;
