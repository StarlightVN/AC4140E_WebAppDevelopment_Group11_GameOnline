const db = require('../src/config/db');

async function migrate() {
    const [tables] = await db.query(`
        SELECT TABLE_NAME AS tableName
        FROM information_schema.TABLES
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME IN ('contacts', 'feedbacks')
    `);

    const tableNames = new Set(tables.map((table) => table.tableName.toLowerCase()));

    if (tableNames.has('contacts') && !tableNames.has('feedbacks')) {
        await db.query('RENAME TABLE contacts TO feedbacks');
        console.log('Renamed table: contacts -> feedbacks');
    }

    await db.query(`
        CREATE TABLE IF NOT EXISTS feedbacks (
            id INT NOT NULL AUTO_INCREMENT,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL,
            content TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
    `);

    await db.query(`
        CREATE TABLE IF NOT EXISTS system_stats (
            id TINYINT UNSIGNED NOT NULL,
            view_count BIGINT UNSIGNED NOT NULL DEFAULT 0,
            PRIMARY KEY (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
    `);

    await db.query(`
        INSERT INTO system_stats (id, view_count)
        VALUES (1, 0)
        ON DUPLICATE KEY UPDATE id = id
    `);

    console.log('Database migrations completed.');
    await db.end();
}

migrate().catch(async (error) => {
    console.error(error);
    try {
        await db.end();
    } catch {
        // The pool may already be closed after a connection failure.
    }
    process.exit(1);
});
