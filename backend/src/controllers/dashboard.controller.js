import dashboardService from "../services/dashboard.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";
import { MESSAGES } from "../constants/messages.js";

const getStats = asyncHandler(async (req, res) => {
  const stats = await dashboardService.getStats(req.user.id);
  sendSuccess(res, HTTP_STATUS.OK, stats, MESSAGES.DASHBOARD.FETCHED);
});

export default { getStats };
