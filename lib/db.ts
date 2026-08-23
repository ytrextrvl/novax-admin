import postgres from 'postgres';

type SqlClient = ReturnType<typeof postgres>;

let client: SqlClient | null = null;

export function getDb(): SqlClient {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL_MISSING');
  }

  if (!client) {
    client = postgres(connectionString, {
      ssl: 'require',
      max: 3,
      idle_timeout: 20,
      connect_timeout: 10,
      prepare: false,
    });
  }

  return client;
}
