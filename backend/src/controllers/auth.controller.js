import authService from "../services/auth.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";
import { MESSAGES } from "../constants/messages.js";

const signup = asyncHandler(async (req, res) => {
  const result = await authService.signup(req.body);
  sendSuccess(res, HTTP_STATUS.CREATED, result, MESSAGES.AUTH.SIGNUP_SUCCESS);
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  sendSuccess(res, HTTP_STATUS.OK, result, MESSAGES.AUTH.LOGIN_SUCCESS);
});

const logout = asyncHandler(async (req, res) => {
  sendSuccess(res, HTTP_STATUS.OK, null, MESSAGES.AUTH.LOGOUT_SUCCESS);
});

export default { signup, login, logout };
