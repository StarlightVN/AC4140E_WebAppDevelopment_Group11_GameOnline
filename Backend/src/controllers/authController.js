const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'quiz-arena-dev-secret';

function getCredentials(body) {
    return {
        username: body.username?.trim(),
        password: body.password ?? ''
    };
}

function sendServerError(res, error) {
    console.error(error);
    return res.status(500).json({ message: 'Lỗi server!' });
}

const authController = {
    register: async (req, res) => {
        try {
            const { username, password } = getCredentials(req.body);

            if (!username || password.length < 3) {
                return res.status(400).json({
                    message: 'Tên đăng nhập và mật khẩu cần ít nhất 3 ký tự.'
                });
            }

            const [existingUsers] = await db.query(
                'SELECT id FROM users WHERE username = ?',
                [username]
            );

            if (existingUsers.length > 0) {
                return res.status(400).json({ message: 'Tên đăng nhập đã tồn tại!' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            await db.query(
                'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
                [username, hashedPassword, 'user']
            );

            return res.status(201).json({ message: 'Đăng ký tài khoản thành công!' });
        } catch (error) {
            return sendServerError(res, error);
        }
    },

    login: async (req, res) => {
        try {
            const { username, password } = getCredentials(req.body);

            if (!username || !password) {
                return res.status(400).json({ message: 'Vui lòng nhập tên đăng nhập và mật khẩu.' });
            }

            const [users] = await db.query(
                'SELECT id, username, password, role FROM users WHERE username = ?',
                [username]
            );

            if (users.length === 0) {
                return res.status(400).json({ message: 'Tên đăng nhập không tồn tại!' });
            }

            const user = users[0];
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({ message: 'Mật khẩu không chính xác!' });
            }

            const token = jwt.sign(
                { id: user.id, role: user.role },
                JWT_SECRET,
                { expiresIn: '1d' }
            );

            return res.json({
                message: 'Đăng nhập thành công!',
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    role: user.role
                }
            });
        } catch (error) {
            return sendServerError(res, error);
        }
    }
};

module.exports = authController;
