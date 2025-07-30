const { ContentUnit, Question } = require("../models");

const getContent = async (req, res) => {
  try {
    const limit = parseInt(req.body.limit) || 1;
    const offset = parseInt(req.body.offset) || 0; 

    const unitsWithQuestions = await ContentUnit.findAll({
      limit,
      offset,
      order: [["createdAt", "DESC"]], 
      include: [
        {
          model: Question,
          as: "questions",
        },
      ],
    });
    const total = await ContentUnit.count();
    return res.json({data: unitsWithQuestions, total: total});
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch content" });
  }
};

const addContent = async (req, res) => {
  try {
    const { content } = req.body;
    console.log(content);
    
  }
  catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to add content" });
  }
}

module.exports = { getContent, addContent };
