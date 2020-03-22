const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, 'some_secrect_token_for_hashing');
    next();
  } catch (err) {
    res.status(401).json({
      status: 'fail',
      message: 'Authorization failed'
    })
  }
}
