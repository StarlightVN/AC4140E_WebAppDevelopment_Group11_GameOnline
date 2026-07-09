const db = require('../config/db');

const QUESTION_COUNT = 15;

function sendServerError(res, error, message = 'Lỗi server!') {
    console.error(error);
    return res.status(500).json({ message });
}

async function findRoomByCode(roomCode) {
    const [rooms] = await db.query(
        'SELECT id, status FROM rooms WHERE room_code = ?',
        [roomCode]
    );

    return rooms[0] ?? null;
}

async function createUniqueRoomCode() {
    for (let attempt = 0; attempt < 5; attempt += 1) {
        const roomCode = Math.floor(100000 + Math.random() * 900000).toString();
        const [rooms] = await db.query('SELECT id FROM rooms WHERE room_code = ?', [roomCode]);

        if (rooms.length === 0) {
            return roomCode;
        }
    }

    throw new Error('Không tạo được mã phòng duy nhất.');
}

async function pickQuestionIds() {
    const questionIds = [];

    for (let difficulty = 1; difficulty <= QUESTION_COUNT; difficulty += 1) {
        const [questions] = await db.query(
            'SELECT id FROM questions WHERE difficulty = ? ORDER BY RAND() LIMIT 1',
            [difficulty]
        );

        if (questions.length === 0) {
            throw new Error(`Ngân hàng câu hỏi chưa có câu ở mức độ khó ${difficulty}.`);
        }

        questionIds.push(questions[0].id);
    }

    return questionIds;
}

async function countCorrectAnswers(roomId, answers) {
    const [correctAnswers] = await db.query(
        `SELECT q.id, q.correct_answer
         FROM questions q
         JOIN room_questions rq ON q.id = rq.question_id
         WHERE rq.room_id = ?`,
        [roomId]
    );

    return correctAnswers.reduce((total, question) => {
        return total + (answers[question.id] === question.correct_answer ? 1 : 0);
    }, 0);
}

const roomController = {
    createRoom: async (req, res) => {
        try {
            const { userId } = req.body;
            const roomCode = await createUniqueRoomCode();
            const questionIds = await pickQuestionIds();

            const [roomResult] = await db.query(
                'INSERT INTO rooms (room_code, created_by) VALUES (?, ?)',
                [roomCode, userId || null]
            );

            for (const questionId of questionIds) {
                await db.query(
                    'INSERT INTO room_questions (room_id, question_id) VALUES (?, ?)',
                    [roomResult.insertId, questionId]
                );
            }

            return res.status(201).json({
                message: 'Tạo phòng thành công! Các câu hỏi đã được xếp từ dễ đến khó.',
                roomCode,
                questionCount: questionIds.length
            });
        } catch (error) {
            const status = error.message.includes('Ngân hàng câu hỏi') ? 400 : 500;
            console.error(error);
            return res.status(status).json({ message: error.message });
        }
    },

    getRoomQuestions: async (req, res) => {
        try {
            const { roomCode } = req.params;
            const room = await findRoomByCode(roomCode);

            if (!room) {
                return res.status(404).json({ message: 'Không tìm thấy phòng chơi này!' });
            }

            const [questions] = await db.query(
                `SELECT q.id, q.content, q.option_A, q.option_B, q.option_C, q.option_D, q.difficulty
                 FROM questions q
                 JOIN room_questions rq ON q.id = rq.question_id
                 WHERE rq.room_id = ?
                 ORDER BY q.difficulty ASC`,
                [room.id]
            );

            return res.status(200).json({
                message: 'Lấy danh sách câu hỏi thành công!',
                roomCode,
                status: room.status,
                totalQuestions: questions.length,
                questions
            });
        } catch (error) {
            return sendServerError(res, error);
        }
    },

    submitScore: async (req, res) => {
        try {
            const { roomCode } = req.params;
            const { userId, answers, correctCount } = req.body;
            const room = await findRoomByCode(roomCode);

            if (!room) {
                return res.status(404).json({ message: 'Không tìm thấy phòng chơi này!' });
            }

            const hasAnswers = answers && typeof answers === 'object' && !Array.isArray(answers);
            const verifiedCorrectCount = hasAnswers
                ? await countCorrectAnswers(room.id, answers)
                : correctCount;

            if (!Number.isInteger(verifiedCorrectCount) || verifiedCorrectCount < 0) {
                return res.status(400).json({ message: 'Dữ liệu đáp án không hợp lệ!' });
            }

            await db.query(
                `INSERT INTO leaderboard (room_id, user_id, correct_count)
                 VALUES (?, ?, ?)
                 ON DUPLICATE KEY UPDATE correct_count = ?`,
                [room.id, userId, verifiedCorrectCount, verifiedCorrectCount]
            );

            return res.status(200).json({
                message: 'Nộp điểm thành công!',
                roomCode,
                userId,
                correctCount: verifiedCorrectCount
            });
        } catch (error) {
            return sendServerError(res, error, 'Lỗi server khi nộp điểm!');
        }
    },

    getLeaderboard: async (req, res) => {
        try {
            const { roomCode } = req.params;
            const room = await findRoomByCode(roomCode);

            if (!room) {
                return res.status(404).json({ message: 'Không tìm thấy phòng chơi!' });
            }

            const [leaderboard] = await db.query(
                `SELECT u.username, l.correct_count
                 FROM leaderboard l
                 JOIN users u ON l.user_id = u.id
                 WHERE l.room_id = ?
                 ORDER BY l.correct_count DESC
                 LIMIT 10`,
                [room.id]
            );

            return res.status(200).json({ message: 'Thành công', leaderboard });
        } catch (error) {
            return sendServerError(res, error);
        }
    },

    addComment: async (req, res) => {
        try {
            const { roomCode } = req.params;
            const { name, email, content, rating } = req.body;
            const cleanRating = Number(rating);

            if (!name?.trim() || !email?.trim() || !content?.trim()) {
                return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin đánh giá!' });
            }

            if (!Number.isInteger(cleanRating) || cleanRating < 1 || cleanRating > 5) {
                return res.status(400).json({ message: 'Điểm đánh giá phải từ 1 đến 5.' });
            }

            const room = await findRoomByCode(roomCode);

            if (!room) {
                return res.status(404).json({ message: 'Không tìm thấy phòng chơi!' });
            }

            await db.query(
                'INSERT INTO comments (room_id, name, email, content, rating) VALUES (?, ?, ?, ?, ?)',
                [room.id, name.trim(), email.trim(), content.trim(), cleanRating]
            );

            return res.status(201).json({ message: 'Cảm ơn bạn đã đánh giá!' });
        } catch (error) {
            return sendServerError(res, error, 'Lỗi server khi gửi bình luận!');
        }
    },

    getComments: async (req, res) => {
        try {
            const { roomCode } = req.params;
            const room = await findRoomByCode(roomCode);

            if (!room) {
                return res.status(404).json({ message: 'Không tìm thấy phòng chơi!' });
            }

            const [comments] = await db.query(
                'SELECT name, content, rating, created_at FROM comments WHERE room_id = ? ORDER BY created_at DESC',
                [room.id]
            );

            return res.status(200).json({ comments });
        } catch (error) {
            return sendServerError(res, error);
        }
    }
};

module.exports = roomController;
