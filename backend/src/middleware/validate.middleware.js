import ApiError from "../utils/apiError.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";
import { MESSAGES } from "../constants/messages.js";

const validate =
  (schema, source = "body") =>
  (req, res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const message = error.details.map((detail) => detail.message).join(", ");
      return next(
        new ApiError(
          HTTP_STATUS.BAD_REQUEST,
          "VALIDATION_ERROR",
          message || MESSAGES.COMMON.VALIDATION_ERROR,
        ),
      );
    }

    if (source === "query") {
      Object.assign(req.query, value);
    } else {
      req[source] = value;
    }

    next();
  };

export default validate;
