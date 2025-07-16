const db = require('../../config/db');

/**
 * @desc    Create a new user
 * @route   POST /api/users
 * @access  Public
 */
const createUser = async (req, res, next) => {
  const { name, email } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id, name, email',
      [name, email]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    // Unique constraint violation for email
    if (err.code === '23505') {
       return res.status(409).json({ message: 'Error: Email already exists.' });
    }
    next(err);
  }
};

module.exports = {
  createUser,
};
