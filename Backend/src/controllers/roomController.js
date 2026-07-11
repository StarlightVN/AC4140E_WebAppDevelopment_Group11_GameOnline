const db = require('../config/db');

const QUESTION_COUNT = 15;
const ANSWER_KEYS = ['A', 'B', 'C', 'D'];

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

function normalizeQuestionInput(body) {
    const content = typeof body.content === 'string' ? body.content.trim() : '';
    const optionA = typeof body.option_A === 'string' ? body.option_A.trim() : '';
    const optionB = typeof body.option_B === 'string' ? body.option_B.trim() : '';
    const optionC = typeof body.option_C === 'string' ? body.option_C.trim() : '';
    const optionD = typeof body.option_D === 'string' ? body.option_D.trim() : '';
    const correctAnswer = typeof body.correct_answer === 'string'
        ? body.correct_answer.trim().toUpperCase()
        : '';
    const difficulty = Number(body.difficulty);

    if (!content || !optionA || !optionB || !optionC || !optionD) {
        return { error: 'Vui lòng nhập nội dung câu hỏi và đầy đủ 4 đáp án.' };
    }

    if (!ANSWER_KEYS.includes(correctAnswer)) {
        return { error: 'Đáp án đúng phải là A, B, C hoặc D.' };
    }

    if (!Number.isInteger(difficulty) || difficulty < 1 || difficulty > QUESTION_COUNT) {
        return { error: 'Độ khó phải là số nguyên từ 1 đến 15.' };
    }

    return {
        value: {
            content,
            option_A: optionA,
            option_B: optionB,
            option_C: optionC,
            option_D: optionD,
            correct_answer: correctAnswer,
            difficulty
        }
    };
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
    },
    
    getAllCommentsAdmin: async (req, res) => {
        try {
            const [comments] = await db.query(
                'SELECT id, name AS author, rating, content, created_at FROM comments ORDER BY created_at DESC'
            );
            return res.json({ comments });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Lỗi server khi lấy bình luận!' });
        }
    },

    deleteCommentAdmin: async (req, res) => {
        try {
            const { id } = req.params;
            await db.query('DELETE FROM comments WHERE id = ?', [id]);
            return res.json({ message: 'Xóa bình luận thành công!' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Lỗi server khi xóa bình luận!' });
        }
    },

    getAllQuestionsAdmin: async (req, res) => {
        try {
            const [questions] = await db.query(
                `SELECT id, content, option_A, option_B, option_C, option_D,
                        correct_answer, difficulty
                 FROM questions
                 ORDER BY difficulty ASC, id ASC`
            );

            return res.json({ total: questions.length, questions });
        } catch (error) {
            return sendServerError(res, error, 'Lỗi server khi lấy ngân hàng câu hỏi!');
        }
    },

    createQuestionAdmin: async (req, res) => {
        try {
            const normalized = normalizeQuestionInput(req.body);

            if (normalized.error) {
                return res.status(400).json({ message: normalized.error });
            }

            const question = normalized.value;
            const [result] = await db.query(
                `INSERT INTO questions
                    (content, option_A, option_B, option_C, option_D, correct_answer, difficulty)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    question.content,
                    question.option_A,
                    question.option_B,
                    question.option_C,
                    question.option_D,
                    question.correct_answer,
                    question.difficulty
                ]
            );

            return res.status(201).json({
                message: 'Thêm câu hỏi thành công!',
                question: { id: result.insertId, ...question }
            });
        } catch (error) {
            return sendServerError(res, error, 'Lỗi server khi thêm câu hỏi!');
        }
    },

    updateQuestionAdmin: async (req, res) => {
        try {
            const questionId = Number(req.params.id);
            const normalized = normalizeQuestionInput(req.body);

            if (!Number.isInteger(questionId) || questionId < 1) {
                return res.status(400).json({ message: 'ID câu hỏi không hợp lệ.' });
            }

            if (normalized.error) {
                return res.status(400).json({ message: normalized.error });
            }

            const question = normalized.value;
            const [result] = await db.query(
                `UPDATE questions
                 SET content = ?, option_A = ?, option_B = ?, option_C = ?, option_D = ?,
                     correct_answer = ?, difficulty = ?
                 WHERE id = ?`,
                [
                    question.content,
                    question.option_A,
                    question.option_B,
                    question.option_C,
                    question.option_D,
                    question.correct_answer,
                    question.difficulty,
                    questionId
                ]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Không tìm thấy câu hỏi.' });
            }

            return res.json({
                message: 'Cập nhật câu hỏi thành công!',
                question: { id: questionId, ...question }
            });
        } catch (error) {
            return sendServerError(res, error, 'Lỗi server khi cập nhật câu hỏi!');
        }
    },

    deleteQuestionAdmin: async (req, res) => {
        const questionId = Number(req.params.id);

        if (!Number.isInteger(questionId) || questionId < 1) {
            return res.status(400).json({ message: 'ID câu hỏi không hợp lệ.' });
        }

        let connection;

        try {
            connection = await db.getConnection();
            await connection.beginTransaction();
            await connection.query('DELETE FROM room_questions WHERE question_id = ?', [questionId]);
            const [result] = await connection.query('DELETE FROM questions WHERE id = ?', [questionId]);

            if (result.affectedRows === 0) {
                await connection.rollback();
                return res.status(404).json({ message: 'Không tìm thấy câu hỏi.' });
            }

            await connection.commit();
            return res.json({ message: 'Xóa câu hỏi thành công!' });
        } catch (error) {
            if (connection) {
                await connection.rollback();
            }
            return sendServerError(res, error, 'Lỗi server khi xóa câu hỏi!');
        } finally {
            connection?.release();
        }
    }
};

module.exports = roomController;
