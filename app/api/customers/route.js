import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function GET(request) {
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

// If `OPTIONS` is not defined, Next.js will automatically implement `OPTIONS` and set the appropriate Response `Allow` header depending on the other methods defined in the Route Handler.
export async function OPTIONS(request) {}
