const express = require('express');
const roomController = require('../controllers/roomController');
const requireAdmin = require('../middleware/requireAdmin');

const router = express.Router();

router.post('/create', roomController.createRoom);
router.use('/admin', requireAdmin);
router.get('/admin/comments/all', roomController.getAllCommentsAdmin);
router.delete('/admin/comments/:id', roomController.deleteCommentAdmin);
router.get('/admin/questions', roomController.getAllQuestionsAdmin);
router.post('/admin/questions', roomController.createQuestionAdmin);
router.put('/admin/questions/:id', roomController.updateQuestionAdmin);
router.delete('/admin/questions/:id', roomController.deleteQuestionAdmin);

router.post('/:roomCode/submit', roomController.submitScore);

router.get('/:roomCode/leaderboard', roomController.getLeaderboard);
router.post('/:roomCode/comments', roomController.addComment);
router.get('/:roomCode/comments', roomController.getComments);

router.get('/:roomCode', roomController.getRoomQuestions);

module.exports = router;
