const db = require('../src/config/db');

async function migrate() {
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
