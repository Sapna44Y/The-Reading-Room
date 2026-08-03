import User from "../models/user.model.js";
import ApiError from "../utils/apiError.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";
import { MESSAGES } from "../constants/messages.js";
import password from "../utils/password.js";
import jwt from "../utils/jwt.js";

const toPublicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
});

const signup = async ({ name, email, password: plainPassword }) => {
  const duplicateUser = await User.findOne({ email });
  if (duplicateUser) {
    throw new ApiError(
      HTTP_STATUS.CONFLICT,
      "EMAIL_IN_USE",
      MESSAGES.AUTH.EMAIL_IN_USE,
    );
  }

  const passwordHash = await password.hash(plainPassword);
  const user = await User.create({ name, email, password: passwordHash });

  const token = jwt.sign({ userId: user._id });
  return { token, user: toPublicUser(user) };
};

const login = async ({ email, password: plainPassword }) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new ApiError(
      HTTP_STATUS.UNAUTHORIZED,
      "INVALID_CREDENTIALS",
      MESSAGES.AUTH.INVALID_CREDENTIALS,
    );
  }

  const passwordMatches = await password.compare(plainPassword, user.password);
  if (!passwordMatches) {
    throw new ApiError(
      HTTP_STATUS.UNAUTHORIZED,
      "INVALID_CREDENTIALS",
      MESSAGES.AUTH.INVALID_CREDENTIALS,
    );
  }

  const token = jwt.sign({ userId: user._id });
  return { token, user: toPublicUser(user) };
};

export default { signup, login };
