const { sign, verify } = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const create_tokens = (user) => {
  const accessToken = sign(
    { email: user.email, id: user._id }, 
    JWT_SECRET
  );
  return accessToken;
};


const is_signed_in = (req, res, next) => {
  const accessToken = req.cookies["access-token"];

  if (!accessToken)
    return res.redirect('/error-page');

  try {
    const validToken = verify(accessToken, JWT_SECRET);
    if (validToken) {
      req.authenticated = true;
      return next();
    }
  } catch (err) {
    return res.redirect('/error-page');
  }
};

const is_not_signed_in = (req, res, next) => {
  const accessToken = req.cookies["access-token"];

  if (accessToken) {
    res.redirect('/profile');
  } else {
    return next();
  }
};

module.exports = { create_tokens, is_signed_in, is_not_signed_in }