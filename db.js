const { Pool } = require('pg');

// Set up PostgreSQL connection
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'NewDB',
    password: '12345678',
    port: 5432,
});

// Export the pool so other files can use it
module.exports = pool;