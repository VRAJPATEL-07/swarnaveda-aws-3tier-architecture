const jwt = require('jsonwebtoken');

const authMiddleware = (requiredAdmin = false) => (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: 'Authorization required' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');
    req.user = payload;
    if (requiredAdmin && !payload.isAdmin) return res.status(403).json({ message: 'Admin access required' });
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
