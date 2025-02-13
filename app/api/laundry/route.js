import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function PUT(request) {
  try {
    const { id, received } = await request.json(); // Expecting id and received status in the request body

    const result = await pool.query(
      'UPDATE laundry_items SET received = $1 WHERE id = $2 RETURNING *',
      [received, id]
    );

    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ error: 'Customer not found' }), { status: 404 });
    }

    return new Response(JSON.stringify(result.rows[0]), { status: 200 }); // Send back the updated laundry item data
  } catch (error) {
    console.error('Error updating laundry item:', error);
    return new Response(JSON.stringify({ error: 'Failed to update laundry item', details: error.message }), { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { customerId, amountOfLaundry, extras, totalPrice, createdAt, received } = await request.json();

    const result = await pool.query(
      'INSERT INTO laundry_items (customer_id, amount_of_laundry, extras, total_price, created_at, received) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [customerId, amountOfLaundry, extras, totalPrice, createdAt, received]
    );

    return new Response(JSON.stringify(result.rows[0]), { status: 201 }); // Send back the created laundry item data
  } catch (error) {
    console.error('Error creating laundry item:', error);
    return new Response(JSON.stringify({ error: 'Failed to create laundry item', details: error.message }), { status: 500 });
  }
}

export async function GET(request) {
  const url = new URL(request.url);
  const customerId = url.searchParams.get('customerId'); // Get customerId from query parameters
  try {
    const query = customerId 
      ? `SELECT li.*, c.name, c.number 
         FROM laundry_items li 
         JOIN customers c ON li.customer_id = c.id 
         WHERE li.customer_id = $1;`
      : `SELECT li.*, c.name, c.number 
         FROM laundry_items li 
         JOIN customers c ON li.customer_id = c.id;`;
    
    const params = customerId ? [customerId] : [];
    const result = await pool.query(query, params);

    console.log(result.rows);
    
    return new Response(JSON.stringify(result.rows), { status: 200 }); // Send back the combined data
  } catch (error) {
    console.error('Error fetching laundry data:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch laundry data', details: error.message }), { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    if (!id) {
      return new Response(JSON.stringify({ error: 'ID is required' }), { status: 400 }); // More accurate error message
    }

    const result = await pool.query('DELETE FROM laundry_items WHERE id = $1', [id]);

    if (result.rowCount > 0) { // Check if any rows were deleted
       return new Response(null, { status: 204 }); // 204 No Content is standard for DELETE
    } else {
      return new Response(JSON.stringify({error: 'Laundry Item not found'}), {status: 404});
    }
  } catch (error) {
    console.error('Error deleting laundry history:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to delete laundry history', details: error.message }),
      { status: 500 }
    );
  }
}
