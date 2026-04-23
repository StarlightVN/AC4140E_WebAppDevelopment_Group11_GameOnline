const mysql = require('mysql2/promise');
require('dotenv').config();

// Tạo một pool kết nối (giúp xử lý nhiều người chơi cùng lúc tốt hơn)
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Kiểm tra kết nối thử
pool.getConnection()
    .then(connection => {
        console.log('✅ Đã kết nối thành công với MySQL Database!');
        connection.release(); // Nhả kết nối ra sau khi test xong
    })
    .catch(err => {
        console.error('Lỗi kết nối Database:', err.message);
    });

module.exports = pool;