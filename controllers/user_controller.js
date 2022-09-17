const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/User')
const { rand_string, send_email } = require('./email_confirmation');
const { create_tokens } = require('../middleware/auth_middleware');

//@desc   Register new user
//@route  POST /api/users
//@access Public
const register_user = asyncHandler(async (req, res) => {
  const { name, surname, email, password } = req.body

  if (!name || !email || !password) {
    res.status(400)
    throw new Error('Add all fields')
  }

  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error('Email already taken')
  }

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)
  const is_confirmed = false;
  const unique_string = rand_string();
 
  const user = await User.create({
      name, 
      surname,
      email,
      password: hashedPassword,
      unique_string,
      is_confirmed
  })

  if (user) {
    send_email(email, unique_string);
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: create_tokens(user._id)
    })    
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

//@desc   Authorize user
//@route  POST /api/users/login
//@access Public

const login_user = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email } )

  if (user.is_confirmed === false) {
    res.status(400);
    throw new Error('Confirm you email')
  }

  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = create_tokens(user);
    res.cookie("access-token", accessToken, {
      maxAge: 60 * 60 * 6 * 1000,
      httpOnly: true
    });
    res.cookie("user-password", password, {
      maxAge: 60 * 60 * 6 * 1000,
      httpOnly: true
    });
    res.cookie("user", user, {
      maxAge: 60 * 60 * 6 * 1000,
      httpOnly: true
    });
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: create_tokens(user._id)
    }) 
  } else {
    res.status(400)
    throw new Error('Invalid credentials!')
  }

})

module.exports = { login_user, register_user }