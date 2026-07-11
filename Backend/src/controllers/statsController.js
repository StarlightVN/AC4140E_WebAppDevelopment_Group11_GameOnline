const db = require('../config/db');

const statsController = {
    incrementView: async (req, res) => {
        try {
            await db.query(`
                INSERT INTO system_stats (id, view_count)
                VALUES (1, 1)
                ON DUPLICATE KEY UPDATE view_count = view_count + 1
            `);
            return res.json({ message: 'Đã tăng lượt xem thành công!' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Lỗi server khi tăng lượt xem!' });
        }
    },

    getViewCount: async (req, res) => {
        try {
            const [rows] = await db.query('SELECT view_count FROM system_stats WHERE id = 1');
            const viewCount = rows[0]?.view_count ?? 0;
            return res.json({ view_count: viewCount });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Lỗi server khi lấy số lượt xem!' });
        }
    }
};

module.exports = statsController;
