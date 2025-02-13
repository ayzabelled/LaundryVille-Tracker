import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM customers');
    return new Response(JSON.stringify(result.rows), { status: 200 });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch customers' }), { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { name, number } = await request.json(); // Get name and number from request body
    const result = await pool.query(
      'INSERT INTO customers (name, number) VALUES ($1, $2) RETURNING *',
      [name, number]
    );
    return new Response(JSON.stringify(result.rows[0]), { status: 201 }); // Send back the created customer data
  } catch (error) {
    console.error('Error creating customer:', error);
    return new Response(JSON.stringify({ error: 'Failed to create customer', details: error.message }), { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { customer_id } = await request.json(); // Get customer_id from request body
    if (!customer_id) {
      return new Response(JSON.stringify({ error: 'customer_id is required' }), { status: 400 });
    }

    await pool.query('DELETE FROM laundry_items WHERE customer_id = $1', [customer_id]);

    const result = await pool.query('DELETE FROM customers WHERE id = $1 RETURNING *', [customer_id]); // Use customer_id here!

    if (result.rowCount === 0) {
      return new Response(JSON.stringify({ error: 'Customer not found' }), { status: 404 });
    }

    return new Response(JSON.stringify(result.rows[0]), { status: 200 });

  } catch (error) {
    console.error('Error deleting customer and laundry history:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to delete customer and laundry history', details: error.message }),
      { status: 500 }
    );
  }
}

// If `OPTIONS` is not defined, Next.js will automatically implement `OPTIONS` and set the appropriate Response `Allow` header depending on the other methods defined in the Route Handler.
export async function OPTIONS() {}
