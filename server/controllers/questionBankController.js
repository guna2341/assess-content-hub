const db = require('../models');
const questionBankService = require('../services/questionBankService')(db);

const ApiError = require('../utils/apiError');

class QuestionBankController {
  // Topic controllers
  async getAllTopics(req, res, next) {
    try {
      const topics = await questionBankService.getAllTopics();
      res.json(topics);
    } catch (error) {
      next(error);
    }
  }

  async getTopicById(req, res, next) {
    try {
      const topic = await questionBankService.getTopicById(req.params.id);
      if (!topic) {
        throw new ApiError(404, 'Topic not found');
      }
      res.json(topic);
    } catch (error) {
      next(error);
    }
  }

  async createTopic(req, res, next) {
    try {
      const { name, parent_id } = req.body;
      const topic = await questionBankService.createTopic({ name, parent_id });
      res.status(201).json(topic);
    } catch (error) {
      next(error);
    }
  }

  async updateTopic(req, res, next) {
    try {
      const topic = await questionBankService.updateTopic(req.params.id, req.body);
      res.json(topic);
    } catch (error) {
      next(error);
    }
  }

  async deleteTopic(req, res, next) {
    try {
      await questionBankService.deleteTopic(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async getTopicPath(req, res, next) {
    try {
      const path = await questionBankService.getTopicPath(req.params.id);
      res.json(path);
    } catch (error) {
      next(error);
    }
  }

  async countQuestionsInTopic(req, res, next) {
    try {
      const count = await questionBankService.countQuestionsInTopic(req.params.id);
      res.json({ count });
    } catch (error) {
      next(error);
    }
  }

  // Question controllers
  async getQuestionsByTopic(req, res, next) {
    try {
      const questions = await questionBankService.getQuestionsByTopic(req.params.topicId);
      res.json(questions);
    } catch (error) {
      next(error);
    }
  }

  async createQuestion(req, res, next) {
    try {
      const question = await questionBankService.createQuestion(
        req.params.topicId,
        req.body
      );
      res.status(201).json(question);
    } catch (error) {
      next(error);
    }
  }

  async getQuestionById(req, res, next) {
    try {
      const question = await questionBankService.getQuestionById(req.params.id);
      if (!question) {
        throw new ApiError(404, 'Question not found');
      }
      res.json(question);
    } catch (error) {
      next(error);
    }
  }

  async updateQuestion(req, res, next) {
    try {
      const question = await questionBankService.updateQuestion(
        req.params.id,
        req.body
      );
      res.json(question);
    } catch (error) {
      next(error);
    }
  }

  async deleteQuestion(req, res, next) {
    try {
      await questionBankService.deleteQuestion(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  // Comment controllers
  async addComment(req, res, next) {
  try {
    const comment = await questionBankService.addComment(
      req.params.questionId,
      req.body,
      req.user.id // Assuming you have auth middleware
    );
    res.status(201).json(comment);
  } catch (error) {
    next(error);
  }
}

  async getCommentsForQuestion(req, res, next) {
    try {
      const comments = await questionBankService.getCommentsForQuestion(
        req.params.questionId
      );
      res.json(comments);
    } catch (error) {
      next(error);
    }
  }

  async updateComment(req, res, next) {
    try {
      const comment = await questionBankService.updateComment(
        req.params.id,
        req.body
      );
      res.json(comment);
    } catch (error) {
      next(error);
    }
  }

  async deleteComment(req, res, next) {
    try {
      await questionBankService.deleteComment(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new QuestionBankController();