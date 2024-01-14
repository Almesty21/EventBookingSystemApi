const Booking = require("../models/booking");
const Event = require("../models/event");
const asyncHandler =require('express-async-handler');
const mongoose = require('mongoose');

// @desc    Create an booking
// @route   POST /api/booking
// @access  Private
/* const createBooking = asyncHandler(async (req, res) => {
  try {
    const { user_id, event_id, event, booking_date, status } = req.body;
	console.log("req.body: ", req.body);

// Validate input
if (!user_id || !event_id || !event || !booking_date || !status) {
  return res.status(400).json({
    message: "Please provide all required fields: user_id, event_id, event, booking_date, status",
  });
}

    const existingEventId = req.body.event_id;
   if (!mongoose.Types.ObjectId.isValid(existingEventId)) {
         return res.status(400).json({ message: 'Invalid event ID format ${existingEventId}' });
       }
	const existingEvent = await Event.findById(existingEventId);
    
    if (!existingEvent) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    const booking = new Booking({
      _id: new mongoose.Types.ObjectId(),
      event_id,
	  user_id,
	  event,
      booking_date,
      status,
    });
    const result = await booking.save();
     
    res.status(201).json({
      message: "Event Booked successfully!",
      createdBooking: {
        _id: result._id,
		event_id:result.event_id,
	    user_id:result.user_id,
        event: result.event,
        booking_date: result.booking_date,
        status: result.status,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
        request: {
          type: "GET",
          url: `http://localhost:3000/bookings/${result._id}`,
        },
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}); */

const createBooking = asyncHandler(async (req, res) => {
  try {
    // Extract data from the request body
    const { user_id, event_id, event, booking_date, status } = req.body;
    console.log("req.body: ", req.body);

    // Validate input
    if (!user_id || !event_id || !event || !booking_date || !status) {
      return res.status(400).json({
        message: "Please provide all required fields: user_id, event_id, event, booking_date, status",
      });
    }

    // Validate event_id format
    if (!mongoose.Types.ObjectId.isValid(event_id)) {
      return res.status(400).json({ message: `Invalid event ID format ${event_id}` });
    }

    // Check if the event with the provided event_id exists
    const existingEvent = await Event.findById(event_id);
    if (!existingEvent) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    // Create a new Booking
    const booking = new Booking({
      _id: new mongoose.Types.ObjectId(),
      event_id,
      user_id,
      event,
      booking_date,
      status,
    });

    // Save the Booking to the database
    const result = await booking.save();

    // Respond with the created Booking
    res.status(201).json({
      message: "Event Booked successfully!",
      createdBooking: {
        _id: result._id,
        event_id: result.event_id,
        user_id: result.user_id,
        event: result.event,
        booking_date: result.booking_date,
        status: result.status,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
        request: {
          type: "GET",
          url: `http://localhost:3000/bookings/${result._id}`,
        },
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private
const getByIdBookings = asyncHandler(async (req, res) => {
  try {
    const bookings = await Booking.find().select("-__v")

    const response = {
      count: bookings.length,
      bookings: bookings.map((booking) => {
        return {
          _id: booking._id,
          event: booking.event,
          booking_date: booking.booking_date,
          status: booking.status,
          createdAt: booking.createdAt,
          updatedAt: booking.updatedAt,
          request: {
            description: "Get booking by id",
            type: "GET",
            url: `http://localhost:3000/bookings/${booking._id}`,
          },
        };
      }),
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// @desc    Update booking
// @route   PUT /api/bookings/:bookingId
// @access  Private
const updateBookingById = asyncHandler(async (req, res) => {
    try {
        const bookingId = req.params.bookingId;

        // Check if the booking exists
        const booking = await Booking.findById(bookingId);

        if (booking) {
            // Update the booking details
            await Booking.updateOne(
                { _id: bookingId },
                {
                    $set: {
                        status: req.body.status,
                        booking_date: req.body.booking_date,
                        event: req.body.event,
                    },
                }
            );

            res.status(200).json({
                message: "Booking updated successfully!",
                request: {
                    type: "GET",
                    url: `http://localhost:3000/bookings/${bookingId}`,
                },
            });
        } else {
            return res.status(404).json({
                message: "Booking not found",
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
});



// @desc    Delete Booking
// @route   DELETE /api/Booking/:bookingId
// @access  Private
const deleteBookingById = asyncHandler(async (req, res) => {
  const bookingId = req.params.bookingId;

  try {
    // Find the booking by ID
    const booking = await Booking.findById(bookingId);

    if (!booking) {    

    // If the booking is found, remove it
    await Booking.deleteOne({ _id: bookingId });

    res.status(200).json({
      message: "Booking deleted successfully!",
      request: {
        type: "POST",
        description: "You can create a new booking with this URL:",
        url: "http://localhost:3000/bookings",
        body: {
          eventId: "ID",
          booking_date: "Date",
          status: "String",
        },
      },
    });}
	else{
	// If the booking is not found, respond with a 404 status and an error message
      return res.status(404).json({
        message: "Booking not found",
      });
	  }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

module.exports = {
  createBooking,
  getByIdBookings,
  updateBookingById,
  deleteBookingById
};
