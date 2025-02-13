import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function GET(request) {
  try {
const url = new URL(request.url);
const reportType = url.searchParams.get('reportType'); // Get the report type from the query parameters


    let query = '';

    switch (reportType) {
      case 'daily':
        query = `
          SELECT SUM(total_price) AS daily_earnings
          FROM laundry_items
          WHERE created_at >= DATE_TRUNC('day', CURRENT_TIMESTAMP)
            AND created_at < DATE_TRUNC('day', CURRENT_TIMESTAMP) + INTERVAL '1 day';
        `;
        break;
      case 'weekly':
        query = `
          SELECT SUM(total_price) AS weekly_earnings
          FROM laundry_items
          WHERE created_at >= DATE_TRUNC('week', CURRENT_TIMESTAMP)
            AND created_at < DATE_TRUNC('week', CURRENT_TIMESTAMP) + INTERVAL '1 week';
        `;
        break;
      case 'monthly':
        query = `
          SELECT SUM(total_price) AS monthly_earnings
          FROM laundry_items
          WHERE created_at >= DATE_TRUNC('month', CURRENT_TIMESTAMP)
            AND created_at < DATE_TRUNC('month', CURRENT_TIMESTAMP) + INTERVAL '1 month';
        `;
        break;
      case 'annually':
        query = `
          SELECT SUM(total_price) AS annual_earnings
          FROM laundry_items
          WHERE created_at >= DATE_TRUNC('year', CURRENT_TIMESTAMP)
            AND created_at < DATE_TRUNC('year', CURRENT_TIMESTAMP) + INTERVAL '1 year';
        `;
        break;
      default:
        return new Response(JSON.stringify({ error: 'Invalid report type' }), { status: 400 });
    }

    const result = await pool.query(query);
    return new Response(JSON.stringify(result.rows[0]), { status: 200 }); // Send back the report data
  } catch (error) {
    console.error('Error fetching report:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch report' }), { status: 500 });
  }
}

export async function OPTIONS() {}
