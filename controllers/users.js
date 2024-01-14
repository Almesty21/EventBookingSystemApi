const asyncHandler =require('express-async-handler');
const { User, validate } = require('../models/user');
const bcrypt = require('bcrypt');
const generateToken = require('../utils/generateToken.js');

// @desc    Register a new user
// @route   POST /api/signup
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  // Validate user input
  const { error } = validate(req.body);
  if (error) {
    res.status(400).json({ error: error.details[0].message });
    return;
  }

  const { name, email, password } = req.body;

  // Check if the user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400).json({ error: 'User already exists' });
    return;
  }

  try {
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create the user with an automatically generated _id
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    const savedUser = await user.save();

    // Log the result (optional)
    console.log(savedUser);

    // Respond with user details
    res.status(201).json({
      message: "User created successfully!",
      createdUser: {
        _id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        createdAt: savedUser.createdAt,
        updatedAt: savedUser.updatedAt,
        request: {
          type: "GET",
          url: "http://localhost:3000/users/" + savedUser._id,
        },
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



//login User
//@desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    })
  } else {
    res.status(401)
    throw new Error('Invalid email or password')
  }
})

// @desc    Get all users
// @route   GET /api/users/Id
// @access  Private
const getUserById = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-__v");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    else{
    res.status(200).json({
      user: user,
    });
  }} 
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});


// @desc    Update user
// @route   PUT /api/users/:userId
// @access  Private
const updateUserById = asyncHandler(async (req, res) => {
  try {
    // Check if the email is valid and not already in use
    const existingUser = await User.findOne({ email: req.body.email, _id: { $ne: req.params.userId } });
    //console.log(existingUser);
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already in use by another user.' });
    }

    // Hash the password if provided
    let hashedPassword;
    if (req.body.password) {
      const saltRounds = 10;
      hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    }

    // Update the user
    const result = await User.updateOne(
	
      { _id: req.params.userId },
      {
        $set: {
          name: req.body.name,
          email: req.body.email,
          password: hashedPassword,
        }
      },
	   { new: true }// Returns the updated document
    );
	
	//console.log(req.params.userId);
    //console.log(result);
    if (result && result.matchedCount > 0) {
      // Check if any document was matched
      res.status(200).json({
        message: "User updated successfully!",
        request: {
          type: "GET",
          description: "You can get the updated user with this URL:",
          url: "http://localhost:3000/users/" + req.params.userId,
        },
      });
    } else {
      res.status(404).json({
        error: 'User not found',
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// @desc    Delete user
// @route   DELETE /api/users/:usersId
// @access  Private
const deleteUserById = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  //console.log(userId)
  try {
    // Find the user by ID
    const user = await User.findById(userId);
   console.log(user)
    if (user) {
      // If the user is found, remove them
      //await user.remove();
      await User.deleteOne({ _id: userId });
      //res.json({ message: 'User removed' 
      res.status(200).json({
        message: "User deleted successfully!",
        request: {
          type: "POST",
          description: "You can create a new user with this URL:",
          url: "http://localhost:3000/users/signup",
          body: {
            name: "String",
            email: "String",
            password: "String",
          },
        },
      });
    } 
	else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});


module.exports = {
  registerUser,
  loginUser,
  getUserById,
  updateUserById,
  deleteUserById
};