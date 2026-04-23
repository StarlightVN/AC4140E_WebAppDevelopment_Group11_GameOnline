const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db'); // Gọi file kết nối DB chạy lên

const app = express();

// Middleware
app.use(cors()); // Cho phép Web và App gọi API không bị chặn
app.use(express.json()); // Cho phép server đọc được dữ liệu dạng JSON
// Cấu hình các API routes
app.use('/api/auth', require('./routes/authRoutes')); // API quản lý đăng ký và đăng nhập
app.use('/api/room', require('./routes/roomRoutes')); // API quản lý phòng thi đấu

// Viết một API Test thử xem server có hoạt động không
app.get('/', (req, res) => {
    res.send(' Chào mừng đến với API của Cổng Game Trắc Nghiệm!');
});

// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(` Server đang chạy tại http://localhost:${PORT}`);
});