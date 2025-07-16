const { body, validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const userCreationRules = () => [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Must be a valid email address'),
];

const eventCreationRules = () => [
  body('title').notEmpty().withMessage('Title is required'),
  body('date').isISO8601().toDate().withMessage('Date must be a valid ISO 8601 date'),
  body('location').notEmpty().withMessage('Location is required'),
  body('capacity')
    .isInt({ min: 1, max: 1000 })
    .withMessage('Capacity must be an integer between 1 and 1000'),
];

const registrationRules = () => [
    body('userId').isUUID().withMessage('A valid userId is required'),
];

module.exports = {
  validateRequest,
  userCreationRules,
  eventCreationRules,
  registrationRules,
};
