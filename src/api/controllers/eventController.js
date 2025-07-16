const db = require('../../config/db');

/**
 * @desc    Create a new event
 * @route   POST /api/events
 * @access  Public
 */
const createEvent = async (req, res, next) => {
  const { title, date, location, capacity } = req.body;

  try {
    const result = await db.query(
      'INSERT INTO events (title, date, location, capacity) VALUES ($1, $2, $3, $4) RETURNING id',
      [title, date, location, capacity]
    );
    res.status(201).json({ message: 'Event created successfully', eventId: result.rows[0].id });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get details for a single event, including registered users
 * @route   GET /api/events/:id
 * @access  Public
 */
const getEventById = async (req, res, next) => {
  const { id } = req.params;

  try {
    // Fetch event details
    const eventResult = await db.query('SELECT * FROM events WHERE id = $1', [id]);
    if (eventResult.rows.length === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }
    const event = eventResult.rows[0];

    // Fetch registered users for the event
    const usersResult = await db.query(
      `SELECT u.id, u.name, u.email 
       FROM users u 
       JOIN registrations r ON u.id = r.user_id 
       WHERE r.event_id = $1`,
      [id]
    );

    event.registrations = usersResult.rows;

    res.status(200).json(event);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Register a user for an event
 * @route   POST /api/events/:id/register
 * @access  Public
 */
const registerForEvent = async (req, res, next) => {
  const { id: eventId } = req.params;
  const { userId } = req.body;
  const client = await db.getClient(); // Use a client for transaction

  try {
    await client.query('BEGIN');

    // Lock the event row to handle concurrent requests
    const eventResult = await client.query('SELECT * FROM events WHERE id = $1 FOR UPDATE', [eventId]);
    if (eventResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Event not found' });
    }
    const event = eventResult.rows[0];

    // Constraint: Cannot register for past events
    if (new Date(event.date) < new Date()) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'Cannot register for a past event' });
    }

    // Get current number of registrations
    const registrationCountResult = await client.query('SELECT COUNT(*) FROM registrations WHERE event_id = $1', [eventId]);
    const registrationCount = parseInt(registrationCountResult.rows[0].count, 10);
    
    // Constraint: Cannot register if event is full
    if (registrationCount >= event.capacity) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'Event is full' });
    }

    // Constraint: No duplicate registrations (also handled by DB constraint, but this gives a clearer message)
    try {
        await client.query(
          'INSERT INTO registrations (event_id, user_id) VALUES ($1, $2)',
          [eventId, userId]
        );
    } catch(err) {
        if (err.code === '23505') { // unique_violation
            await client.query('ROLLBACK');
            return res.status(409).json({ message: 'User is already registered for this event' });
        }
        // Handle other potential errors like foreign key violation (user not found)
        if (err.code === '23503') {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'User not found' });
        }
        throw err; // Re-throw other errors to be caught by the outer catch
    }

    await client.query('COMMIT');
    res.status(201).json({ message: 'Successfully registered for the event' });
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
};


/**
 * @desc    Cancel a user's registration for an event
 * @route   DELETE /api/events/:id/register
 * @access  Public
 */
const cancelRegistration = async (req, res, next) => {
  const { id: eventId } = req.params;
  const { userId } = req.body;

  try {
    const result = await db.query(
      'DELETE FROM registrations WHERE event_id = $1 AND user_id = $2',
      [eventId, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Registration not found. User wasn't registered for this event." });
    }

    res.status(200).json({ message: 'Registration cancelled successfully' });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    List all upcoming events, sorted by date then location
 * @route   GET /api/events/upcoming
 * @access  Public
 */
const getUpcomingEvents = async (req, res, next) => {
  try {
    // Custom sorting: First by date (ascending), then by location (alphabetically)
    const result = await db.query(
      "SELECT * FROM events WHERE date > NOW() ORDER BY date ASC, location ASC"
    );
    res.status(200).json(result.rows);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get statistics for an event
 * @route   GET /api/events/:id/stats
 * @access  Public
 */
const getEventStats = async (req, res, next) => {
    const { id } = req.params;
    try {
        const eventResult = await db.query('SELECT capacity FROM events WHERE id = $1', [id]);
        if (eventResult.rows.length === 0) {
            return res.status(404).json({ message: 'Event not found' });
        }
        const capacity = eventResult.rows[0].capacity;

        const registrationResult = await db.query('SELECT COUNT(*) as count FROM registrations WHERE event_id = $1', [id]);
        const totalRegistrations = parseInt(registrationResult.rows[0].count, 10);

        const remainingCapacity = capacity - totalRegistrations;
        const percentageUsed = capacity > 0 ? (totalRegistrations / capacity) * 100 : 0;

        res.status(200).json({
            totalRegistrations,
            remainingCapacity,
            capacityUsedPercentage: `${percentageUsed.toFixed(2)}%`
        });

    } catch(err) {
        next(err);
    }
};

module.exports = {
  createEvent,
  getEventById,
  registerForEvent,
  cancelRegistration,
  getUpcomingEvents,
  getEventStats,
};
