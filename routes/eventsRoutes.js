const express = require('express');
const router = express.Router(); 

// Import your middleware and controller
const Auth = require('../middleware/auth');
const eventsController = require('../controllers/events');

// Define your API endpoints
router.post('/createEvent', Auth, eventsController.createEvent);
router.get('/getEvents', eventsController.getEvents);
router.get('/getEventById/:eventId', eventsController.getEventById);
router.put('/updateEventById/:eventId', Auth, eventsController.updateEventById);
router.delete('/deleteEventById/:eventId', Auth, eventsController.deleteEventById);

module.exports = router;
