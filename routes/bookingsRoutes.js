const express = require('express');
const router = express.Router();
const Auth = require('../middleware/auth'); 

// Import your bookings controller
const bookingsController = require('../controllers/bookings');

// Define your API endpoints
router.post('/createBooking', Auth, bookingsController.createBooking);
router.get('/getByIdBookings/:bookingid', Auth, bookingsController.getByIdBookings);
router.put('/updateBookingById/:bookingId', Auth, bookingsController.updateBookingById);
router.delete('/deleteBookingById/:bookingid', Auth, bookingsController.deleteBookingById);

module.exports = router;