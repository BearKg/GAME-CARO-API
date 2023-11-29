const {
  CustomAPIError,
  UnauthenticatedError,
  NotFoundError,
  BadRequestError,
} = require('../errors/index')

const testAdmin = (req, res, next) => {
  if (req.user.testAdmin) {
    throw new UnauthenticatedError(`User isn't admin`)
  }
  next()
}

module.exports = testAdmin
