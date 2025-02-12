"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {useRouter} from "next/navigation"

export type Customer = {
  id: string;
  name: string;
  number: string;
  received: boolean;
}


export const customerColumns: ColumnDef<Customer>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )
    },
    cell: ({ row }) => {
      const customer: string = row.getValue("name");
      return <div className="flex justify-center">{customer}</div>;
    },
  },
  {
    accessorKey: "number",
    header: () => <div className="flex justify-center">Phone No.</div>,
    cell: ({ row }) => {
      const number = parseFloat(row.getValue("number"))
      return <div className="flex justify-center">{number}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original
      const router = useRouter()

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="text-xs font-bold">Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-xs" onClick={() => router.push(`/laundry-history/${payment.id}`)}>View Laundry History</DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-red-500 text-xs hover:text-white hover:bg-red-500" 
              onClick={async () => {
                const confirmDelete = window.confirm("Are you sure you want to delete this customer?");
                if (confirmDelete) {
                  const response = await fetch(`/api/customers`, {
                    method: 'DELETE',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ customer_id: payment.id }), // Include customer_id in the request body
                  });

                  if (!response.ok) {
                    console.error('Failed to delete customer');
                  } else {
                    // Refresh the page after successful deletion
                    window.location.reload();
                  }
                }
              }}
            >
              Delete
            </DropdownMenuItem>

          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
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
    header: () => <div className="flex justify-center">✅</div>,
    cell: ({ row }) => {

      const handleCheckboxChange = async (checked: boolean) => {
        row.original.received = checked;

        // Make API call to update the received value
        const response = await fetch(`/api/laundry`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: row.original.id,
            received: checked,
          }),
        });

        if (!response.ok) {
          console.error('Failed to update received status');
        } else {
          // Refresh the page after successful update
          window.location.reload();
        }

      };


      return (
        <div className="flex justify-center">
          <Checkbox
            checked={row.original.received}
            onCheckedChange={handleCheckboxChange}
            aria-label="Select row"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: () => <div className="flex justify-center">Name</div>,
    cell: ({ row }) => {
      const customer: string = row.getValue("name");
      return <div className="flex justify-center">{customer}</div>;
    },
  },
  {
    accessorKey: "number",
    header: () => <div className="flex justify-center">Phone No.</div>,
    cell: ({ row }) => {
      const number = parseFloat(row.getValue("number"))
      return <div className="flex justify-center">{number}</div>
    },
  },
  {
    accessorKey: "amount_of_laundry",
    header: () => <div className="flex justify-center">🧺</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount_of_laundry"))
      return <div className="flex justify-center">{amount}</div>
    },
  },
  {
    accessorKey: "total_price",
    header: () => <div className="flex justify-center">Total</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("total_price"))
      const formatted = new Intl.NumberFormat("fil-PH", {
        style: "currency",
        currency: "PHP",
      }).format(amount)

      return <div className="flex justify-center">{formatted}</div>
    },


  },
]
