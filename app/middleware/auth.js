import jwt from 'jsonwebtoken';
import config from '../config.js';

const auth = (req, res, next) => {

  const token = req.headers['authorization']

  if(!token)
    res.status(401).send('No token provided.');
  try {
    jwt.verify(token, config.JwtSecret);
    next();
  }
  catch (ex) {
    res.status(401).send('Invalid token.');
  }
};

export default auth;
