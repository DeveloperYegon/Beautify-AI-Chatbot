// middleware/validationMiddleware.js
const Joi = require('joi');

exports.askSchema = Joi.object({
  question: Joi.string().min(3).max(500).required(),
  thread_id: Joi.string().uuid()
});
exports.validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    next();
  };