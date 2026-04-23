const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authController = {
    // 1. API Đăng ký tài khoản
    register: async (req, res) => {
        try {
            const { username, password } = req.body;

            // Kiểm tra xem username đã tồn tại chưa
            const [existingUser] = await db.query('SELECT * FROM Users WHERE username = ?', [username]);
            if (existingUser.length > 0) {
                return res.status(400).json({ message: 'Tên đăng nhập đã tồn tại!' });
            }

            // Mã hóa mật khẩu
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Lưu user mới vào database (mặc định role là 'user')
            await db.query('INSERT INTO Users (username, password, role) VALUES (?, ?, ?)', [username, hashedPassword, 'user']);

            res.status(201).json({ message: 'Đăng ký tài khoản thành công!' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Lỗi server!' });
        }
    },

    // 2. API Đăng nhập
    login: async (req, res) => {
        try {
            const { username, password } = req.body;

            // Tìm user trong database
            const [users] = await db.query('SELECT * FROM Users WHERE username = ?', [username]);
            if (users.length === 0) {
                return res.status(400).json({ message: 'Tên đăng nhập không tồn tại!' });
            }

            const user = users[0];

            // So sánh mật khẩu
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Mật khẩu không chính xác!' });
            }

            // Tạo Token thông hành (Hết hạn sau 1 ngày)
            const token = jwt.sign({ id: user.id, role: user.role }, 'Bí_mật_của_bạn_nằm_ở_đây', { expiresIn: '1d' });

            res.json({
                message: 'Đăng nhập thành công!',
                token: token,
                user: { id: user.id, username: user.username, role: user.role }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Lỗi server!' });
        }
    }
};

module.exports = authController;