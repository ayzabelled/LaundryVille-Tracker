// components/ReportsDashboard.tsx
"use client"
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ReportsDashboard: React.FC = () => {
  const [dailyEarnings, setDailyEarnings] = useState<number | null>(null);
  const [weeklyEarnings, setWeeklyEarnings] = useState<number | null>(null);
  const [monthlyEarnings, setMonthlyEarnings] = useState<number | null>(null);
  const [annualEarnings, setAnnualEarnings] = useState<number | null>(null);

  const [loading, setLoading] = useState<boolean>(false);


  const [error, setError] = useState<string | null>(null);

  const fetchReport = async (reportType: string) => {
    setLoading(true); // Set loading to true when fetching starts

    try {
      const response = await fetch(`/api/reports?reportType=${encodeURIComponent(reportType)}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch report');
      }
      const data = await response.json();
      return data;
    } catch (err) {
      console.error(`Error fetching ${reportType} report:`, err);
      if (err instanceof Error) { // Type guard
        setError(err.message);
      } else {
        setError("An unknown error occurred."); // Or some other generic message
      }
      return null;
    }
  };

  const [selectedReportType, setSelectedReportType] = useState<string | null>('daily');


  const handleReportSelection = async (reportType: string) => {
    setSelectedReportType(reportType);
    const earnings = await fetchReport(reportType);
    setLoading(false); // Set loading to false when fetching ends


    if (reportType === 'daily') {
      setDailyEarnings(earnings?.daily_earnings ? parseFloat(earnings.daily_earnings) : null);
    } else if (reportType === 'weekly') {
      setWeeklyEarnings(earnings?.weekly_earnings ? parseFloat(earnings.weekly_earnings) : null);
    } else if (reportType === 'monthly') {
      setMonthlyEarnings(earnings?.monthly_earnings ? parseFloat(earnings.monthly_earnings) : null);
    } else if (reportType === 'annually') {
      setAnnualEarnings(earnings?.annual_earnings ? parseFloat(earnings.annual_earnings) : null);

    }

  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger>Earnings Reports</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Filter</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleReportSelection('daily')}>Daily</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleReportSelection('weekly')}>Weekly</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleReportSelection('monthly')}>Monthly</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleReportSelection('annually')}>Annually</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {loading && (
        <div className="flex justify-center items-center">
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
      {selectedReportType === 'daily' && !loading && <p>Daily: ₱{typeof dailyEarnings === 'number' ? dailyEarnings.toFixed(2) : '0.00'}</p>}

      {selectedReportType === 'weekly' && !loading && <p>Weekly: ₱{typeof weeklyEarnings === 'number' ? weeklyEarnings.toFixed(2) : '0.00'}</p>}

      {selectedReportType === 'monthly' && !loading && <p>Monthly: ₱{typeof monthlyEarnings === 'number' ? monthlyEarnings.toFixed(2) : '0.00'}</p>}

      {selectedReportType === 'annually' && !loading && <p>Annually: ₱{typeof annualEarnings === 'number' ? annualEarnings.toFixed(2) : '0.00'}</p>}

    </div>
  );
};

export default ReportsDashboard;
