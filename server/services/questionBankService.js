class QuestionBankService {
  constructor(models) {
    this.models = models;
  }

  async getAllTopics() {
    const { Topic, QuestionBank } = this.models;

    const topics = await Topic.findAll();
    return topics;
  }

  async getTopicById(id) {
  const { Topic } = this.models;

  return Topic.findByPk(id, {
    include: [
      {
        model: Topic,
        as: 'children',
      },
    ],
  });
}

  async createTopic({ name, parent_id = null }) {
    const { Topic } = this.models;
    return Topic.create({ name, parent_id });
  }

  async updateTopic(id, updates) {
    const topic = await Topic.findByPk(id);
    if (!topic) throw new Error("Topic not found");
    return topic.update(updates);
  }

  async deleteTopic(id) {
    const topic = await Topic.findByPk(id, {
      include: [
        { model: Topic, as: "children" },
        { model: QuestionBank, as: "questions" },
      ],
    });

    if (!topic) throw new Error("Topic not found");

    // Delete all children recursively
    if (topic.children && topic.children.length > 0) {
      for (const child of topic.children) {
        await this.deleteTopic(child.id);
      }
    }

    // Delete all questions
    if (topic.questions && topic.questions.length > 0) {
      for (const question of topic.questions) {
        await QuestionBank.destroy({ where: { id: question.id } });
      }
    }

    return topic.destroy();
  }

  // Question operations
  async getQuestionsByTopic(topicId) {
    return QuestionBank.findAll({
      where: { topicId },
      include: [{ model: Comment, as: "comments" }],
      order: [["createdAt", "ASC"]],
    });
  }

  async createQuestion(topicId, questionData) {
    return QuestionBank.create({
      ...questionData,
      topicId,
    });
  }

  async getQuestionById(id) {
    return QuestionBank.findByPk(id, {
      include: [
        { model: Topic, as: "topic" },
        { model: Comment, as: "comments" },
      ],
    });
  }

  async updateQuestion(id, updates) {
    const question = await QuestionBank.findByPk(id);
    if (!question) throw new Error("Question not found");
    return question.update(updates);
  }

  async deleteQuestion(id) {
    const question = await QuestionBank.findByPk(id);
    if (!question) throw new Error("Question not found");
    return question.destroy();
  }

  // Comment operations
  async addComment(questionId, commentData) {
    return Comment.create({
      ...commentData,
      questionId,
    });
  }

  async getCommentsForQuestion(questionId) {
    return Comment.findAll({
      where: { questionId },
      order: [["createdAt", "ASC"]],
    });
  }

  async updateComment(id, updates) {
    const comment = await Comment.findByPk(id);
    if (!comment) throw new Error("Comment not found");
    return comment.update(updates);
  }

  async deleteComment(id) {
    const comment = await Comment.findByPk(id);
    if (!comment) throw new Error("Comment not found");
    return comment.destroy();
  }

  // Helper methods
  async getTopicPath(topicId) {
    const path = [];
    let currentId = topicId;

    while (currentId) {
      const topic = await Topic.findByPk(currentId, {
        attributes: ["id", "name", "parentId"],
      });
      if (!topic) break;
      path.unshift(topic);
      currentId = topic.parent_id;
    }

    return path;
  }

  async countQuestionsInTopic(topicId) {
    const topic = await Topic.findByPk(topicId, {
      include: [
        {
          model: Topic,
          as: "children",
          include: [{ model: Topic, as: "children" }],
        },
        { model: QuestionBank, as: "questions" },
      ],
    });

    if (!topic) return 0;

    let count = topic.questions ? topic.questions.length : 0;

    if (topic.children && topic.children.length > 0) {
      for (const child of topic.children) {
        count += await this.countQuestionsInTopic(child.id);
      }
    }

    return count;
  }
}

module.exports = (models) => new QuestionBankService(models);
