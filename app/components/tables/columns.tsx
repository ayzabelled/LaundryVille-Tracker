"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"

export type Customer = {
  id: string;
  name: string;
  number: string;
}


export const customerColumns: ColumnDef<Customer>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "number",
    header: "Number",
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <button onClick={() => (row.original.id)}>
        View Laundry Items
      </button>
    ),
  },
]

export type CustomersList = {
  name: string; // from customers api
  customer_id: string; // the rest from laundry_items api
  id: string;
  amount_of_laundry: number;
  extras: string;
  total_price: number;
  received: boolean;
}

export const listColumn: ColumnDef<CustomersList>[] = [
  {
    accessorKey: "received",
    header: "✅",
    cell: ({ row }) => {

        const handleCheckboxChange = (checked: boolean) => { 
            row.original.received = checked;
        };

        return (
            <Checkbox  // Your custom Checkbox component
                checked={row.original.received}
                onCheckedChange={handleCheckboxChange} 
                aria-label="Select row"
            />
        );
    },
},
   {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "number",
    header: "Number",
  },
  {
    accessorKey: "amount_of_laundry",
    header: "🧺",
  },
  {
    accessorKey: "total_price",
    header: "Total",
  },
]
