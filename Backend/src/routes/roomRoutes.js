const express = require('express');
const roomController = require('../controllers/roomController');

const router = express.Router();

router.post('/create', roomController.createRoom);
router.post('/:roomCode/submit', roomController.submitScore);

router.get('/:roomCode/leaderboard', roomController.getLeaderboard);
router.post('/:roomCode/comments', roomController.addComment);
router.get('/:roomCode/comments', roomController.getComments);

router.get('/:roomCode', roomController.getRoomQuestions);
router.get('/admin/comments/all', roomController.getAllCommentsAdmin);
router.delete('/admin/comments/:id', roomController.deleteCommentAdmin);

module.exports = router;
