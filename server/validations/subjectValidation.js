const Joi = require('joi');

const createSubjectSchema = Joi.object({
  name: Joi.string().required().min(3).max(100)
});

module.exports = {
  createSubjectSchema
};