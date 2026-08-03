import bookService from "../services/book.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";
import { MESSAGES } from "../constants/messages.js";

const list = asyncHandler(async (req, res) => {
  const books = await bookService.list(req.user.id, req.query);
  sendSuccess(res, HTTP_STATUS.OK, books, MESSAGES.BOOK.FETCHED);
});

const create = asyncHandler(async (req, res) => {
  const book = await bookService.create(req.user.id, req.body);
  sendSuccess(res, HTTP_STATUS.CREATED, book, MESSAGES.BOOK.CREATED);
});

const update = asyncHandler(async (req, res) => {
  const book = await bookService.update(req.params.id, req.user.id, req.body);
  sendSuccess(res, HTTP_STATUS.OK, book, MESSAGES.BOOK.UPDATED);
});

const remove = asyncHandler(async (req, res) => {
  await bookService.remove(req.params.id, req.user.id);
  sendSuccess(res, HTTP_STATUS.OK, null, MESSAGES.BOOK.DELETED);
});

export default { list, create, update, remove };
