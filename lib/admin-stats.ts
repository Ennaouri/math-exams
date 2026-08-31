import { pool } from './db';

export async function getAdminInternalStats() {
  try {
    const usersCountRes = await pool.query('SELECT COUNT(*) as total FROM users');
    const postsCountRes = await pool.query('SELECT COUNT(*) as total FROM post');
    const subsCountRes = await pool.query(`SELECT COUNT(*) as total FROM user_subscription WHERE status = 'active'`);
    
    const totalUsers = parseInt(usersCountRes.rows[0].total) || 0;
    const totalPosts = parseInt(postsCountRes.rows[0].total) || 0;
    const activeSubscriptions = parseInt(subsCountRes.rows[0].total) || 0;

    // Top viewed posts based on user_progress
    const topPostsRes = await pool.query(`
      SELECT post_name, post_slug, COUNT(*) as views 
      FROM user_progress 
      GROUP BY post_slug, post_name 
      ORDER BY views DESC 
      LIMIT 10
    `);

    // Registrations in last 30 days grouped by date
    const registrationsRes = await pool.query(`
      SELECT DATE(created_at) as date, COUNT(*) as count 
      FROM users 
      WHERE created_at > NOW() - INTERVAL '30 days' 
      GROUP BY DATE(created_at) 
      ORDER BY date ASC
    `);

    return {
      totalUsers,
      totalPosts,
      activeSubscriptions,
      topViewedPosts: topPostsRes.rows,
      registrations: registrationsRes.rows
    };
  } catch (error) {
    console.error("Error fetching internal stats:", error);
    return {
      totalUsers: 0,
      totalPosts: 0,
      activeSubscriptions: 0,
      topViewedPosts: [],
      registrations: []
    };
  }
}
