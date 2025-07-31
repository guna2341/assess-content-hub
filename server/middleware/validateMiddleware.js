const { ValidationError } = require('joi');

const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property], {
      abortEarly: false,
      allowUnknown: false
    });

    if (error) {
      const errorMessages = error.details.map(detail => detail.message).join(', ');
      return res.status(400).json({
        success: false,
        message: errorMessages
      });
    }

    next();
  };
};

module.exports = validate;