"use client"

import { useState } from 'react'; // Import useState
import { useRouter } from 'next/navigation'; // Import useRouter for navigation
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState(''); 
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter(); 

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission
    setErrorMessage(''); // Reset error message

    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      router.push('/'); 
      console.log(data.message);
    } else {
      // Set error message if login fails
      setErrorMessage(data.error);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>
            Enter your username below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}> {/* Add onSubmit handler */}
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="username" className='font-bold'>Username</Label>
                <Input
                  id="username"
                  type="username"
                  placeholder="Username"
                  required
                  value={email} // Bind email state
                  onChange={(e) => setEmail(e.target.value)} // Update email state
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password" className='font-bold'>Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password} // Bind password state
                  onChange={(e) => setPassword(e.target.value)} // Update password state
                />
              </div>
              {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>} {/* Display error message */}
              <Button type="submit" className="w-full">
                Login
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
