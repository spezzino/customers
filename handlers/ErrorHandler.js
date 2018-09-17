import ApiError from './ApiError';
import InvalidParameter from './InvalidParameter';

function appErrorHandler(err, req, res, next) {
  console.error(`${err.status || 500}  - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  return res.status(err.status || 500)
    .send(new ApiError({
      message: err.message,
      errorCode: err.errorCode || 'internal.server.error'
    }));

}

module.exports = { appErrorHandler };
