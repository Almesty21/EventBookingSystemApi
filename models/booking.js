const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
event_id: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Event',
  required: [true, 'Event ID is required'],
  validate: {
    validator: function(value) {
      return mongoose.Types.ObjectId.isValid(value);
    },
    message: 'Invalid event ID. Please provide a valid ObjectId.',
  },
},
user_id: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  required: [true, 'User ID is required'],
  validate: {
    validator: function(value) {
      return mongoose.Types.ObjectId.isValid(value);
    },
    message: 'Invalid user ID. Please provide a valid ObjectId.',
  },
},
  booking_date: { type: Date, default: Date.now },
  status: { type: String, required: true},
  created_at: { type: Date },
  updated_at: { type: Date},
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);

