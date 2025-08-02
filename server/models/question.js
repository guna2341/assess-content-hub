
// Question Model
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Question extends Model {
    static associate(models) {
      Question.belongsTo(models.ContentUnit, {
        foreignKey: "contentUnitId",
        as: "contentUnit",
        onDelete: "CASCADE",
      });
    }
  }

  Question.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      question: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      correctAnswer: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      createdBy: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.ENUM("published", "approved", "rejected", "pending"),
        defaultValue: "pending", // Add default value
        allowNull: false, // Make it required
      },
      minimumReviews: {
        type: DataTypes.INTEGER,
        defaultValue:3
      },
      totalReviews: {
        type: DataTypes.INTEGER,
        defaultValue:0
      },
      contentUnitId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      explanation: {
        type: DataTypes.TEXT,
      },
    options: {
  type: DataTypes.JSON, // ✅ Supported in MySQL 5.7+
  allowNull: false,
  defaultValue: JSON.stringify([]), // ✅ MySQL needs JSON string
},
      difficulty: {
        type: DataTypes.ENUM("easy", "medium", "hard"),
        defaultValue: "easy",
        allowNull: false,
      },
      topic: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM("multiple choice", "short answer", "long answer"),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Question",
      tableName: "questions",
    }
  );

  // Fixed function to update status counts
  const updateCountsForContentUnit = async (contentUnitId) => {
    try {
      console.log(`🔄 Updating counts for ContentUnit ID: ${contentUnitId}`);

      // Method 1: Using separate queries for each status (more reliable)
      const [published, approved, rejected, pending] = await Promise.all([
        Question.count({ where: { contentUnitId, status: "published" } }),
        Question.count({ where: { contentUnitId, status: "approved" } }),
        Question.count({ where: { contentUnitId, status: "rejected" } }),
        Question.count({ where: { contentUnitId, status: "pending" } }),
      ]);

      // Get current ContentUnit to check minimumReviews
      const contentUnit = await sequelize.models.ContentUnit.findByPk(
        contentUnitId
      );

      if (!contentUnit) {
        console.error(`❌ ContentUnit with ID ${contentUnitId} not found`);
        return;
      }

      const updateObj = {
        published,
        approved,
        rejected,
        pending,
      };

      // If minimumReviews is 3, set completedReviews randomly between 1 and 3
      if (contentUnit.minimumReviews === 3) {
        updateObj.completedReviews = Math.floor(Math.random() * 3) + 1;
      }

      const [updatedCount] = await sequelize.models.ContentUnit.update(
        updateObj,
        {
          where: { id: contentUnitId },
        }
      );

      console.log(
        "🟢 ContentUnit updated with:",
        updateObj,
        "Rows affected:",
        updatedCount
      );

      return updateObj;
    } catch (error) {
      console.error("❌ Error updating counts for ContentUnit:", error);
      throw error;
    }
  };

  // Alternative method using GROUP BY (if you prefer this approach)
  const updateCountsForContentUnitGroupBy = async (contentUnitId) => {
    try {
      console.log(
        `🔄 Updating counts for ContentUnit ID: ${contentUnitId} (GROUP BY method)`
      );

      const statusCounts = await Question.findAll({
        attributes: [
          "status",
          [sequelize.fn("COUNT", sequelize.col("id")), "count"], // Use 'id' instead of 'status'
        ],
        where: {
          contentUnitId,
          status: {
            [sequelize.Op.in]: ["published", "approved", "rejected", "pending"],
          }, // Ensure only valid statuses
        },
        group: ["status"],
        raw: true,
      });

      console.log("📊 Status counts from query:", statusCounts);

      // Initialize all counts to 0
      const countMap = {
        published: 0,
        approved: 0,
        rejected: 0,
        pending: 0,
      };

      // Update counts based on query results
      for (const item of statusCounts) {
        if (item.status && countMap.hasOwnProperty(item.status)) {
          countMap[item.status] = parseInt(item.count, 10) || 0;
        }
      }

      // Get current ContentUnit to check minimumReviews
      const contentUnit = await sequelize.models.ContentUnit.findByPk(
        contentUnitId
      );

      if (!contentUnit) {
        console.error(`❌ ContentUnit with ID ${contentUnitId} not found`);
        return;
      }

      const updateObj = { ...countMap };

      // If minimumReviews is 3, set completedReviews randomly between 1 and 3
      if (contentUnit.minimumReviews === 3) {
        updateObj.completedReviews = Math.floor(Math.random() * 3) + 1;
      }

      const [updatedCount] = await sequelize.models.ContentUnit.update(
        updateObj,
        {
          where: { id: contentUnitId },
        }
      );

      console.log(
        "🟢 ContentUnit updated with:",
        updateObj,
        "Rows affected:",
        updatedCount
      );

      return updateObj;
    } catch (error) {
      console.error(
        "❌ Error updating counts for ContentUnit (GROUP BY):",
        error
      );
      throw error;
    }
  };

  // Hooks
  Question.addHook("afterCreate", async (question, options) => {
    try {
      await updateCountsForContentUnit(question.contentUnitId);
    } catch (err) {
      console.error("❌ Error in afterCreate hook:", err);
    }
  });

  Question.addHook("afterUpdate", async (question, options) => {
    try {
      // Only update if status was changed
      if (question.changed("status")) {
        await updateCountsForContentUnit(question.contentUnitId);
      }
    } catch (err) {
      console.error("❌ Error in afterUpdate hook:", err);
    }
  });

  Question.addHook("afterDestroy", async (question, options) => {
    try {
      await updateCountsForContentUnit(question.contentUnitId);
    } catch (err) {
      console.error("❌ Error in afterDestroy hook:", err);
    }
  });

  Question.addHook("afterBulkCreate", async (questions, options) => {
    try {
      const contentUnitIds = [
        ...new Set(questions.map((q) => q.contentUnitId)),
      ];
      await Promise.all(contentUnitIds.map(updateCountsForContentUnit));
    } catch (err) {
      console.error("❌ Error in afterBulkCreate hook:", err);
    }
  });

  Question.addHook("afterBulkUpdate", async (options) => {
    try {
      // For bulk updates, we need to find affected contentUnitIds
      if (options.where && options.where.contentUnitId) {
        const contentUnitId = options.where.contentUnitId;
        await updateCountsForContentUnit(contentUnitId);
      } else {
        // If no specific contentUnitId, we might need to update all
        console.warn(
          "⚠️ Bulk update without specific contentUnitId - consider updating all affected units"
        );
      }
    } catch (err) {
      console.error("❌ Error in afterBulkUpdate hook:", err);
    }
  });

  Question.addHook("afterBulkDestroy", async (options) => {
    try {
      // Similar to bulk update
      if (options.where && options.where.contentUnitId) {
        const contentUnitId = options.where.contentUnitId;
        await updateCountsForContentUnit(contentUnitId);
      }
    } catch (err) {
      console.error("❌ Error in afterBulkDestroy hook:", err);
    }
  });

  // Add a static method to manually update counts (useful for debugging)
  Question.updateStatusCounts = updateCountsForContentUnit;

  return Question;
};
