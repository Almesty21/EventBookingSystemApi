// server.js
const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');
const { notFound, errorHandler } = require('./middleware/error.js');
const connectDB = require('./config/db.js');
const eventsRoutes = require('./routes/eventsRoutes');
const usersRoutes = require('./routes/usersRoutes');
const bookingsRoutes = require('./routes/bookingsRoutes');

dotenv.config()

connectDB()

const app = express()

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(express.json())

app.use('/api/events', eventsRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/bookings', bookingsRoutes)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
)
