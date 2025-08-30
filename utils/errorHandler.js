function errorHandler(err, req, res, next) {
  const { status, message, errors } = err;
  res.status(status || 500).send({ message, status, errors });
}

module.exports = {
  errorHandler,
};
