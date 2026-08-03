import ApiError from "../utils/apiError.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";
import { MESSAGES } from "../constants/messages.js";
import { NODE_ENV } from "../config/env.js";

export const notFoundHandler = (req, res, next) => {
  next(
    new ApiError(
      HTTP_STATUS.NOT_FOUND,
      "ROUTE_NOT_FOUND",
      MESSAGES.COMMON.ROUTE_NOT_FOUND,
    ),
  );
};

export const errorHandler = (err, req, res, next) => {
  let { statusCode, code, message } = err;

  if (err.name === "ValidationError") {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    code = "VALIDATION_ERROR";
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  } else if (err.name === "CastError") {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    code = "INVALID_ID";
    message = `Invalid value for ${err.path}`;
  } else if (err.code === 11000) {
    statusCode = HTTP_STATUS.CONFLICT;
    code = "DUPLICATE_KEY";
    message = "A record with this value already exists";
  }

  if (!statusCode) {
    statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
    code = "INTERNAL_SERVER_ERROR";
    message = MESSAGES.COMMON.SERVER_ERROR;
  }

  if (NODE_ENV === "development" && !(err instanceof ApiError)) {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    error: { code, message },
  });
};
