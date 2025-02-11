import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function POST(request) {
  try {
    const { username, password } = await request.json();

const result = await pool.query('SELECT * FROM admin WHERE username = $1 AND password = $2', [username, password]);

    if (result.rows.length > 0) {
      return new Response(JSON.stringify({ message: 'Login successful' }), { status: 200 });

    } else {
      return new Response(JSON.stringify({ error: 'Invalid username or password' }), { status: 401 });
    }
  } catch (error) {
    console.error('Error during login:', error);
    return new Response(JSON.stringify({ error: 'Failed to process login', details: error.message }), { status: 500 });
  }
}

export async function OPTIONS(request) { }
