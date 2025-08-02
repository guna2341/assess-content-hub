const Joi = require('joi');

const createTopicSchema = Joi.object({
  name: Joi.string().required().min(3).max(100),
  parent_id: Joi.number().integer().allow(null)
});

const updateTopicSchema = Joi.object({
  name: Joi.string().min(3).max(100),
  parent_id: Joi.number().integer().allow(null)
});

const createQuestionSchema = Joi.object({
  question: Joi.string().required().min(5),
  type: Joi.string().valid('Multiple Choice', 'Short Answer', 'Long Answer').required(),
  difficulty: Joi.string().valid('Easy', 'Medium', 'Hard').required(),
  options: Joi.when('type', {
    is: 'Multiple Choice',
    then: Joi.array().items(Joi.string().min(1)).min(2).max(6).required(),
    otherwise: Joi.array().items(Joi.string()).optional(),
  }),
  correctAnswer: Joi.when('type', {
    is: 'Multiple Choice',
    then: Joi.string().required().regex(/^[A-F]$/),
    otherwise: Joi.string().required(),
  }),
  explanation: Joi.string().allow(''),
  status: Joi.string().valid('pending', 'approved', 'rejected', 'needs_revision'),
});

const updateQuestionSchema = Joi.object({
  question: Joi.string().min(5),
  type: Joi.string().valid('Multiple Choice', 'Short Answer', 'Long Answer'),
  difficulty: Joi.string().valid('Easy', 'Medium', 'Hard'),
  options: Joi.when('type', {
    is: 'Multiple Choice',
    then: Joi.array().items(Joi.string().min(1)).min(2).max(6),
    otherwise: Joi.array().items(Joi.string()).optional(),
  }),
  correctAnswer: Joi.when('type', {
    is: 'Multiple Choice',
    then: Joi.string().regex(/^[A-F]$/),
    otherwise: Joi.string(),
  }),
  explanation: Joi.string().allow(''),
  status: Joi.string().valid('pending', 'approved', 'rejected', 'needs_revision'),
});

const createCommentSchema = Joi.object({
  text: Joi.string().required().min(1),
  type: Joi.string().valid('comment', 'suggestion', 'needs_edit', 'approved', 'rejected'),
  createdBy: Joi.string().required(),
});

const updateCommentSchema = Joi.object({
  text: Joi.string().min(1),
  type: Joi.string().valid('comment', 'suggestion', 'needs_edit', 'approved', 'rejected'),
});

module.exports = {
  createTopicSchema,
  updateTopicSchema,
  createQuestionSchema,
  updateQuestionSchema,
  createCommentSchema,
  updateCommentSchema,
};