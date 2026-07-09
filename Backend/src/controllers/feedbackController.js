const db = require('../config/db');

const feedbackController = {
    createFeedback: async (req, res) => {
        try {
            const name = req.body.name?.trim();
            const email = req.body.email?.trim();
            const content = req.body.content?.trim();

            if (!name || !email || !content) {
                return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin góp ý!' });
            }

            await db.query(
                'INSERT INTO feedbacks (name, email, content) VALUES (?, ?, ?)',
                [name, email, content]
            );

            return res.status(201).json({ message: 'Gửi góp ý thành công!' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Lỗi server khi gửi góp ý!' });
        }
    }
};

module.exports = feedbackController;
