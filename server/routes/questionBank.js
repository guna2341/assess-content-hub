const express = require('express');
const router = express.Router();
const questionBankController = require('../controllers/questionBankController');
const  validate  = require('../middleware/validateMiddleware');
const {
  createTopicSchema,
  updateTopicSchema,
  createQuestionSchema,
  updateQuestionSchema,
  createCommentSchema,
  updateCommentSchema,
} = require('../validations/questionBankValidation');

// Topic routes
router.get('/topics', questionBankController.getAllTopics);
router.get('/topics/:id', questionBankController.getTopicById);
router.post('/topics', validate(createTopicSchema), questionBankController.createTopic);
router.put('/topics/:id', validate(updateTopicSchema), questionBankController.updateTopic);
router.delete('/topics/:id', questionBankController.deleteTopic);
router.get('/topics/:id/path', questionBankController.getTopicPath);
router.get('/topics/:id/count', questionBankController.countQuestionsInTopic);

// Question routes
router.get('/topics/:topicId/questions', questionBankController.getQuestionsByTopic);
router.post('/topics/:topicId/questions', validate(createQuestionSchema), questionBankController.createQuestion);
router.get('/questions/:id', questionBankController.getQuestionById);
router.put('/questions/:id', validate(updateQuestionSchema), questionBankController.updateQuestion);
router.delete('/questions/:id', questionBankController.deleteQuestion);

// Comment routes
router.post('/questions/:questionId/comments', validate(createCommentSchema), questionBankController.addComment);
router.get('/questions/:questionId/comments', questionBankController.getCommentsForQuestion);
router.put('/comments/:id', validate(updateCommentSchema), questionBankController.updateComment);
router.delete('/comments/:id', questionBankController.deleteComment);

module.exports = router;