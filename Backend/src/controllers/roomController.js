const db = require('../config/db');

const roomController = {
    // API Tạo phòng thi đấu mới (Phiên bản Ai Là Triệu Phú - 15 Mức độ)
    createRoom: async (req, res) => {
        try {
            const { userId } = req.body; 

            // 1. Sinh mã phòng ngẫu nhiên 6 chữ số
            const roomCode = Math.floor(100000 + Math.random() * 900000).toString();

            // 2. Lưu phòng mới vào bảng Rooms
            const [roomResult] = await db.query(
                'INSERT INTO Rooms (room_code, created_by) VALUES (?, ?)', 
                [roomCode, userId || null]
            );
            const roomId = roomResult.insertId;

            // 3. Bốc 15 câu hỏi (từ mức 1 đến mức 15)
            const selectedQuestions = [];
            for (let level = 1; level <= 15; level++) {
                // Lấy ngẫu nhiên 1 câu có độ khó = level hiện tại
                const [q] = await db.query(
                    'SELECT id FROM Questions WHERE difficulty = ? ORDER BY RAND() LIMIT 1', 
                    [level]
                );
                
                if (q.length > 0) {
                    selectedQuestions.push(q[0].id);
                } else {
                    // Nếu DB thiếu câu hỏi ở một mức độ nào đó, trả về lỗi ngay
                    return res.status(400).json({ 
                        message: `Ngân hàng câu hỏi không có câu nào ở mức độ khó ${level}. Vui lòng thêm dữ liệu!` 
                    });
                }
            }

            // 4. Nối 15 câu hỏi đã sắp xếp này vào phòng (Lưu vào bảng Room_Questions)
            for (let questionId of selectedQuestions) {
                await db.query(
                    'INSERT INTO Room_Questions (room_id, question_id) VALUES (?, ?)', 
                    [roomId, questionId]
                );
            }

            res.status(201).json({ 
                message: 'Tạo phòng thành công! Các câu hỏi đã được xếp từ dễ đến khó.', 
                roomCode: roomCode,
                questionCount: selectedQuestions.length
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Lỗi server!' });
        }
    },
    // API Lấy danh sách câu hỏi của một phòng cụ thể
    getRoomQuestions: async (req, res) => {
        try {
            const { roomCode } = req.params; // Lấy mã phòng từ đường dẫn URL

            // 1. Kiểm tra xem mã phòng này có tồn tại trong Database không
            const [rooms] = await db.query('SELECT id, status FROM Rooms WHERE room_code = ?', [roomCode]);
            
            if (rooms.length === 0) {
                return res.status(404).json({ message: 'Không tìm thấy phòng chơi này!' });
            }
            
            const roomId = rooms[0].id;

            // 2. Lấy 15 câu hỏi thuộc về phòng này (Sử dụng JOIN 2 bảng)
            // Lưu ý: Cố tình KHÔNG SELECT cột correct_answer để chống gian lận
            const query = `
                SELECT q.id, q.content, q.option_A, q.option_B, q.option_C, q.option_D, q.difficulty
                FROM Questions q
                JOIN Room_Questions rq ON q.id = rq.question_id
                WHERE rq.room_id = ?
                ORDER BY q.difficulty ASC
            `;
            
            const [questions] = await db.query(query, [roomId]);

            res.status(200).json({
                message: 'Lấy danh sách câu hỏi thành công!',
                roomCode: roomCode,
                status: rooms[0].status,
                totalQuestions: questions.length,
                questions: questions // Trả về mảng 15 câu hỏi
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Lỗi server!' });
        }
    },
    // API Nộp điểm sau khi người chơi hoàn thành bộ câu hỏi
    submitScore: async (req, res) => {
        try {
            const { roomCode } = req.params; // Lấy mã phòng từ URL
            const { userId, correctCount } = req.body; // Lấy ID người chơi và số câu đúng từ Body gửi lên

            // 1. Kiểm tra xem mã phòng này có tồn tại không và lấy ra ID của phòng
            const [rooms] = await db.query('SELECT id FROM Rooms WHERE room_code = ?', [roomCode]);
            
            if (rooms.length === 0) {
                return res.status(404).json({ message: 'Không tìm thấy phòng chơi này!' });
            }
            
            const roomId = rooms[0].id;

            // 2. Lưu điểm vào bảng Leaderboard
            // Dùng ON DUPLICATE KEY UPDATE: Nếu người chơi này đã có điểm trong phòng rồi thì cập nhật điểm mới
            await db.query(
                `INSERT INTO Leaderboard (room_id, user_id, correct_count) 
                 VALUES (?, ?, ?) 
                 ON DUPLICATE KEY UPDATE correct_count = ?`,
                [roomId, userId, correctCount, correctCount]
            );

            res.status(200).json({
                message: 'Nộp điểm thành công!',
                roomCode: roomCode,
                userId: userId,
                correctCount: correctCount
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Lỗi server khi nộp điểm!' });
        }
    },
    getLeaderboard: async (req, res) => {
        try {
            const { roomCode } = req.params;

            const [rooms] = await db.query('SELECT id FROM Rooms WHERE room_code = ?', [roomCode]);
            if (rooms.length === 0) return res.status(404).json({ message: 'Không tìm thấy phòng chơi!' });
            const roomId = rooms[0].id;

            // Kết nối bảng Leaderboard và Users để lấy tên người chơi, sắp xếp điểm từ cao xuống thấp
            const query = `
                SELECT u.username, l.correct_count 
                FROM Leaderboard l 
                JOIN Users u ON l.user_id = u.id 
                WHERE l.room_id = ? 
                ORDER BY l.correct_count DESC 
                LIMIT 10
            `;
            const [leaderboard] = await db.query(query, [roomId]);

            res.status(200).json({ message: 'Thành công', leaderboard });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Lỗi server!' });
        }
    },

    // API 2: Gửi Bình luận & Đánh giá (Đúng chuẩn yêu cầu BTL)
    addComment: async (req, res) => {
        try {
            const { roomCode } = req.params;
            const { name, email, content, rating } = req.body;

            const [rooms] = await db.query('SELECT id FROM Rooms WHERE room_code = ?', [roomCode]);
            if (rooms.length === 0) return res.status(404).json({ message: 'Không tìm thấy phòng chơi!' });
            const roomId = rooms[0].id;

            // Lưu bình luận vào Database
            await db.query(
                'INSERT INTO Comments (room_id, name, email, content, rating) VALUES (?, ?, ?, ?, ?)',
                [roomId, name, email, content, rating]
            );

            res.status(201).json({ message: 'Cảm ơn bạn đã đánh giá!' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Lỗi server khi gửi bình luận!' });
        }
    },

    // API 3: Lấy danh sách Bình luận để hiển thị công khai
    getComments: async (req, res) => {
        try {
            const { roomCode } = req.params;

            const [rooms] = await db.query('SELECT id FROM Rooms WHERE room_code = ?', [roomCode]);
            if (rooms.length === 0) return res.status(404).json({ message: 'Không tìm thấy phòng chơi!' });
            const roomId = rooms[0].id;

            // Lấy bình luận mới nhất xếp lên đầu
            const [comments] = await db.query(
                'SELECT name, content, rating, created_at FROM Comments WHERE room_id = ? ORDER BY created_at DESC',
                [roomId]
            );

            res.status(200).json({ comments });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Lỗi server!' });
        }
    }
};

module.exports = roomController;