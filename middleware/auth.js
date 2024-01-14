const asyncHandler = require('express-async-handler');
const jwt = require("jsonwebtoken");
const User = require('../models/user');
const mongoose = require('mongoose');

const validateObjectId = (req, res, next) => {
  const { event } = req.body;

  if (!mongoose.Types.ObjectId.isValid(event)) {
    return res.status(400).json({
      message: 'Invalid event ID. Please provide a valid ObjectId.',
    });
  }

  next(); 
};

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check if the request headers contain a valid token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Verify the token and decode its payload
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user in the database based on the decoded user ID
      //req.user = await User.findById(decoded.id).select('-password');

      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // If no valid token is found
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
});

/* const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
		console.log("token value: ", token);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
	  console.log("decode value: ", decoded);
     
    //req.user = await User.findOne({ _id: decoded.id }).select('-password');

	  req.user = await User.findById(decoded.id).select('-password');
   console.log('req user:', User);
      // Use the validateObjectId middleware here
      validateObjectId(req, res, next);
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
}); */

module.exports = protect;
