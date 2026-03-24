const admin = (req, res, next) => {
  if (req.user && req.user.role === 'Admin') {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as an admin');
  }
};

const technician = (req, res, next) => {
  if (req.user && req.user.role === 'Technician') {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as a technician');
  }
};

module.exports = { admin, technician };
