const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET_KEY;

function adminAuth(req, res, next) {
  //console.log('Authorization Header:', req.headers.authorization);
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).send('Access Denied');
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    if (decoded.role !== 'admin') {
      return res.status(403).send('Access Denied: Admins only');
    }
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).send('Invalid Token');
  }
}



module.exports = adminAuth;
