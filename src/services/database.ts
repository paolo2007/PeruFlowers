import { open } from '@op-engineering/op-sqlite';

export const database = open({
  name: 'peruflowers.db',
});

let initialized = false;

export async function initializeDatabase(): Promise<void> {
  if (initialized) {
    return;
  }

  // Tabla de pedidos
  await database.execute(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY NOT NULL,
      customerName TEXT NOT NULL,
      phone TEXT NOT NULL,
      flowerProduct TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      unitPrice REAL NOT NULL,
      status TEXT NOT NULL,
      priority TEXT NOT NULL DEFAULT 'Media',
      notes TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );
  `);

  // Comprobar si existe la columna priority
  const result = await database.execute('PRAGMA table_info(orders)');

  const columns = result.rows as Array<{ name: string }>;

  const hasPriority = columns.some(column => column.name === 'priority');

  if (!hasPriority) {
    await database.execute(
      "ALTER TABLE orders ADD COLUMN priority TEXT NOT NULL DEFAULT 'Media'",
    );
  }

  // Tabla de credenciales
  await database.execute(`
    CREATE TABLE IF NOT EXISTS account (
      id INTEGER PRIMARY KEY NOT NULL,
      email TEXT NOT NULL,
      password TEXT NOT NULL
    );
  `);

  // Crear cuenta inicial si todavía no existe
  const accountResult = await database.execute(
    'SELECT id FROM account WHERE id = 1',
  );

  if (accountResult.rows.length === 0) {
    await database.execute(
      `INSERT INTO account (id, email, password)
        VALUES (1, ?, ?)`,
      ['admin@peruflowers.com', 'PF2026'],
    );
  }

  initialized = true;
}
