const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

// Đường dẫn tạo phòng (POST)
router.post('/create', roomController.createRoom);

// Đường dẫn lấy danh sách câu hỏi của phòng (GET)
// Dấu hai chấm ":" biểu thị roomCode là một tham số động có thể thay đổi
router.get('/:roomCode', roomController.getRoomQuestions);

// Đường dẫn nộp điểm của người chơi (POST)
// Dùng phương thức POST vì chúng ta đang gửi dữ liệu (điểm số) lên server
router.post('/:roomCode/submit', roomController.submitScore);

// Đường dẫn lấy Bảng xếp hạng (GET)
router.get('/:roomCode/leaderboard', roomController.getLeaderboard);

// Đường dẫn gửi Bình luận & Đánh giá (POST)
router.post('/:roomCode/comments', roomController.addComment);

// Đường dẫn lấy danh sách Bình luận (GET)
router.get('/:roomCode/comments', roomController.getComments);

module.exports = router;