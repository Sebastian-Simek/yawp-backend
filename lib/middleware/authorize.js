module.exports = async (req, res, next) => {
  try {
    if(!req.user || req.user.email !== 'admin')
      throw new Error('You are unauthorized');
    // I don't know whats happening with this next!
    next();
  } catch(e) {
    e.status = 403;
    next(e);
  }
};
