const asyncHandler =require('express-async-handler');
const Event = require('../models/event');
// @desc    Create an event
// @route   POST /api/events
// @access  Private
const createEvent = asyncHandler(async (req, res) => {
  try {
    const { title, description, date, location, capacity } = req.body;

    // Assuming you have a model named Event
    const event = new Event({
      title,
      description,
      date,
      location,
      capacity,
    });

    const createdEvent = await event.save();

    res.status(201).json({
      message: "Event created successfully!",
      createdEvent: {
        _id: createdEvent._id,
        title: createdEvent.title,
        description: createdEvent.description,
        date: createdEvent.date,
        location: createdEvent.location,
        capacity: createdEvent.capacity,
        createdAt: createdEvent.createdAt,
        updatedAt: createdEvent.updatedAt,
        request: {
          description: 'Get the created event',
          type: 'GET',
          url: `http://localhost:3000/events/${createdEvent._id}`
        }
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

// @desc    Get all events
// @route   GET /api/events
// @access  Private
const getEvents = asyncHandler(async (req, res) => {
  try {
    const events = await Event.find({});

    const response = {
      events: {
        number_of_events: events.length,
        events: events.map((event) => {
          return {
            _id: event._id,
            title: event.title,
            description: event.description,
            date: event.date,
            location: event.location,
            capacity: event.capacity,
            createdAt: event.createdAt,
            updatedAt: event.updatedAt,
            request: {
              type: "GET",
              description: "You can get the event by id with this URL:",
              url: `http://localhost:3000/events/${event._id}`,
            },
          };
        }),
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// @desc    Get event by ID
// @route   GET /api/events/:eventId
// @access  Private
const getEventById = asyncHandler(async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId).select("-__v");

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    res.status(200).json({
      event: event,
      request: {
        type: 'GET',
        description: 'Get all events',
        url: 'http://localhost:3000/events',
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// @desc    Update event
// @route   PUT /api/events/:eventId
// @access  Private
const updateEventById = asyncHandler(async (req, res) => {
  const eventId = req.params.eventId;

  // Check if the event exists
  const event = await Event.findById(eventId);

  if (!event) {
    return res.status(404).json({
      message: "Event not found",
    });
  }

  // Update the event details
  await Event.updateOne(
    { _id: eventId },
    {
      $set: {
        title: req.body.title,
        description: req.body.description,
        date: req.body.date,
        location: req.body.location,
        capacity: req.body.capacity,
      },
    }
  );

  res.status(200).json({
    message: "Event updated successfully!",
    request: {
      type: "GET",
      description: "Get the updated event",
      url: `http://localhost:3000/events/${eventId}`,
    },
  });
});

// @desc    Delete event
// @route   DELETE /api/events/:eventId
// @access  Private
const deleteEventById = asyncHandler(async (req, res) => {
  const eventId = req.params.eventId;

  try {
    // Find the event by ID
    const event = await Event.findById(eventId);

    if (!event) {
      // If the event is not found, respond with a 404 status and an error message
      return res.status(404).json({
        message: "Event not found",
      });
    }

    // If the event is found, remove it
    await Event.deleteOne({ _id: eventId });

    res.status(200).json({
      message: "Event deleted successfully!",
      request: {
        type: "POST",
        description: "Create a new event",
        url: "http://localhost:3000/events",
        body: {
          title: "String",
          description: "String",
          date: "String",
          location: "String",
          capacity: "Number",
        },
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});


module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEventById,
  deleteEventById
};
