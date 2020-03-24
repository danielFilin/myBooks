const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'some_secrect_token_for_hashing');
    req.userData = {email: decodedToken.email, userId: decodedToken.userId};
    next();
  } catch (err) {
    res.status(401).json({
      status: 'fail',
      message: 'You are not authenticated'
    })
  }
}
