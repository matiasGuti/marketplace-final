const DATABASE_URL =
  'postgresql://matias:4A86UUsO7K3jN3AypIMvWw@mrkt-latam-10806.7tt.cockroachlabs.cloud:26257/marketplace?sslmode=verify-full';

const { Client } = require('pg');
const pool = new Client(DATABASE_URL);

pool.connect();

module.exports = pool;
