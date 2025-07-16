const express = require('express');
const router = express.Router();
const {
  createEvent,
  getEventById,
  registerForEvent,
  cancelRegistration,
  getUpcomingEvents,
  getEventStats,
} = require('../controllers/eventController');
const { 
    eventCreationRules, 
    registrationRules, 
    validateRequest 
} = require('../middlewares/validator');

// Special route must come before dynamic :id route
router.get('/upcoming', getUpcomingEvents);

// @route   POST /api/events
// @desc    Create a new event
router.post('/', eventCreationRules(), validateRequest, createEvent);

// @route   GET /api/events/:id
// @desc    Get details for a single event
router.get('/:id', getEventById);

// @route   GET /api/events/:id/stats
// @desc    Get statistics for an event
router.get('/:id/stats', getEventStats);

// @route   POST /api/events/:id/register
// @desc    Register a user for an event
router.post('/:id/register', registrationRules(), validateRequest, registerForEvent);

// @route   DELETE /api/events/:id/register
// @desc    Cancel a user's registration
router.delete('/:id/register', registrationRules(), validateRequest, cancelRegistration);


module.exports = router;
