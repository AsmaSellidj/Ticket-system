const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'db',
  database: 'ticketing',
  password: 'postgres',
  port: 5432,
});

async function main() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS societies (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      type VARCHAR(50) CHECK (type IN ('client', 'tech')) NOT NULL,
      contact_email VARCHAR(255),
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await pool.query(`
    INSERT INTO societies (name, type, contact_email)
    VALUES
      ('Techify Solutions', 'tech', 'contact@techify.com'),
      ('GreenLeaf Corp', 'client', 'info@greenleaf.com'),
      ('ByteWorks', 'tech', 'hello@byteworks.com'),
      ('Oceanic Ventures', 'client', NULL)
    ON CONFLICT DO NOTHING;
  `);

  const res = await pool.query('SELECT * FROM societies');
  console.log(res.rows);

  await pool.end();
}

main();
