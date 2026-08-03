import jwt from "../utils/jwt.js";
import ApiError from "../utils/apiError.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";
import { MESSAGES } from "../constants/messages.js";

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(
      new ApiError(
        HTTP_STATUS.UNAUTHORIZED,
        "UNAUTHORIZED",
        MESSAGES.AUTH.UNAUTHORIZED,
      ),
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token);
    req.user = { id: payload.userId };
    next();
  } catch (error) {
    return next(
      new ApiError(
        HTTP_STATUS.UNAUTHORIZED,
        "TOKEN_INVALID",
        MESSAGES.AUTH.TOKEN_INVALID,
      ),
    );
  }
};

export default authenticate;
