module.exports = (err, req, res, next) => {
  // Error logging removed for production

  const { statusCode = 500, message } = err;

  return res.status(statusCode).send({
    message:
      statusCode === 500
        ? "An error has occurred on the server."
        : message,
  });
};
