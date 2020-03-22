const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const router = express.Router();

router.post('/signup', async (req, res, next)  => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      email: req.body.email,
      password: hash
    });
    const newUser = await user.save();
    res.status(201).json({
      message: 'user was created',
      result: newUser
    })
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    })
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const activeUser = await User.findOne({ email: req.body.email});
    if (!activeUser) {
      throw new Error ('user does not exist');
    }
    const user = await bcrypt.compare(req.body.password, activeUser.password);
    if (!user) {
      throw new Error ('user does not exist');
    }

    const token = jwt.sign({email: activeUser.email, userId: activeUser._id}, 'some_secrect_token_for_hashing', { expiresIn: '1h'});

    res.status(200).json({
      token: token
    })

  } catch (err) {
    console.log(err);
    res.status(401).json({
      status: 'fail',
      message: err
    })
  }
})

module.exports = router;
