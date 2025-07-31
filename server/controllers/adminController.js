const { ContentUnit, Question } = require("../models");

const getContent = async (req, res) => {
  try {


    const unitsWithQuestions = await ContentUnit.findAll({
      order: [["createdAt", "DESC"]], 
      include: [
        {
          model: Question,
          as: "questions",
        },
      ],
    });
    const total = await ContentUnit.count();
    setTimeout(() => {
      return res.json({ data: unitsWithQuestions, total: total });
    },2000);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch content" });
  }
};

const addContent = async (req, res) => {
  try {
    const { content } = req.body;
    const user = req.user;
    const { questions, ...newContent } = content;  
    const createContent = await ContentUnit.build(newContent);
    const updatedContent = await createContent.save();
    const newQuestions = [];
    
for (const element of questions) {
  const updatedQuestion = await Question.create({
    contentUnitId: updatedContent.id,
    ...element,
    createdBy:user.name
  });
  newQuestions.push(updatedQuestion.dataValues);
}
      return res.status(201).json({ message: "Content Added Successfully", content: {...updatedContent.dataValues, questions:newQuestions} });
  }
  catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to add content" });
  }
}

const editContent = async (req, res) => {
  try {
    const { contentId } = req.params;
    const { content, questions } = req.body;
    const user = req.user;

    // 1️⃣ Update Content Unit
await ContentUnit.update(
  {
    title: content.title,
    description: content.description,
    status: content.status ?? "pending",
  },
  { where: { id: contentId } }
);


    // 2️⃣ Update/Add Questions
    for (const q of questions) {
      if (q.id && !isNaN(Number(q.id))) {
        // Update existing question
        await Question.update(
          {
            question: q.question,
            correctAnswer: q.correctAnswer,
            status: q.status ?? "pending",
            minimumReviews: q.minimumReviews ?? 3,
            totalReviews: q.totalReviews ?? 0,
            explanation: q.explanation,
            options: q.options || [],
            difficulty: q.difficulty || "easy",
            topic: q.topic,
            type: q.type,
          },
          { where: { id: q.id, contentUnitId: contentId } }
        );
      } else {
        // Create new question
        await Question.create({
          question: q.question,
          correctAnswer: q.correctAnswer,
          status: q.status ?? "pending",
          minimumReviews: q.minimumReviews ?? 3,
          totalReviews: q.totalReviews ?? 0,
          explanation: q.explanation,
          options: q.options || [],
          difficulty: q.difficulty || "easy",
          topic: q.topic,
          type: q.type,
          createdBy: user?.name || "Admin",
          contentUnitId: contentId,
        });
      }
    }

    // 3️⃣ Return updated content with questions
    const updatedContent = await ContentUnit.findOne({
      where: { id: contentId },
      include: [{ model: Question, as: "questions" }],
    });

    return res.status(200).json({
      message: "Content updated successfully",
      content: updatedContent,
    });
  } catch (err) {
    console.error("Error updating content:", err);
    return res.status(500).json({ error: "Failed to update content" });
  }
};



const deleteContent = async (req, res) => {
  try {
    const { contentId, questionId } = req.query;

    if (!contentId) {
      return res.status(400).json({ error: "Content ID is required" });
    }

    if (questionId) {
      const deletedQuestion = await Question.destroy({
        where: { id: questionId, contentUnitId: contentId },
      });

      return deletedQuestion > 0
        ? res.status(200).json({ message: "Question deleted successfully" })
        : res.status(404).json({ error: "Question not found" });
    }

    // Case 2: Delete the entire content
    const deletedContent = await ContentUnit.destroy({
      where: { id: contentId },
    });

    return deletedContent > 0
      ? res.status(200).json({ message: "Content deleted successfully" })
      : res.status(404).json({ error: "Content not found" });
  } catch (err) {
    console.error("Error deleting content/question:", err);
    return res.status(500).json({ error: "Failed to delete content/question" });
  }
};


const addQuestions = async (req, res) => {
  try {
    const { contentId, questions } = req.body;
    const newQuestions = [];
    for (const element of questions) {
      const updatedQuestion = await Question.create({
        contentUnitId: contentId,
        ...element,
      });
      newQuestions.push(updatedQuestion.dataValues);
    }
    return res
      .status(201)
      .json({
        message: "Questions Added Successfully",
        questions: newQuestions,
      });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to add questions" });
  }
};


module.exports = { getContent, addContent, deleteContent, addQuestions, editContent };
