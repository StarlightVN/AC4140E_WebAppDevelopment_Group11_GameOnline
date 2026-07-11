const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'quiz-arena-dev-secret';

function requireAdmin(req, res, next) {
    const authorization = req.headers.authorization ?? '';
    const [scheme, token] = authorization.split(' ');

    if (scheme !== 'Bearer' || !token) {
        return res.status(401).json({ message: 'Bạn cần đăng nhập để thực hiện thao tác này.' });
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET);

        if (payload.role !== 'admin') {
            return res.status(403).json({ message: 'Chỉ quản trị viên được phép thực hiện thao tác này.' });
        }

        req.user = payload;
        return next();
    } catch {
        return res.status(401).json({ message: 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn.' });
    }
}

module.exports = requireAdmin;
