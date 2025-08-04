const { QuestionBank, User, Notification } = require("../config/db");

exports.reviewQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    if (!["approved", "rejected", "needs_revision"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Find question
    const question = await QuestionBank.findByPk(id, {
      include: [{ model: User, as: "author" }],
    });

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Update status
    question.status = status;
    await question.save();

    // Create notification for author
    await Notification.create({
      user_id: question.created_by,
      message: `Your question "${question.question}" has been ${status} by the reviewer.`,
    });

    res.json({ message: `Question ${status} successfully`, question });
  } catch (error) {
    console.error("Review error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
