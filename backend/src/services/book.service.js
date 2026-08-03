import Book from "../models/book.model.js";
import ApiError from "../utils/apiError.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";
import { MESSAGES } from "../constants/messages.js";

const getBookByIdForUser = async (bookId, userId) => {
  const book = await Book.findById(bookId);

  if (!book) {
    throw new ApiError(
      HTTP_STATUS.NOT_FOUND,
      "BOOK_NOT_FOUND",
      MESSAGES.BOOK.NOT_FOUND,
    );
  }

  if (book.userId.toString() !== userId) {
    throw new ApiError(
      HTTP_STATUS.FORBIDDEN,
      "FORBIDDEN",
      MESSAGES.BOOK.FORBIDDEN,
    );
  }

  return book;
};

const list = async (userId, { status, tag }) => {
  const query = { userId };

  if (status) query.status = status;

  if (tag) {
    const safeTag = tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    query.tags = { $elemMatch: { $regex: safeTag, $options: "i" } };
  }

  return Book.find(query).sort({ createdAt: -1 });
};

const create = async (userId, bookData) => Book.create({ ...bookData, userId });

const update = async (bookId, userId, updates) => {
  const book = await getBookByIdForUser(bookId, userId);

  Object.assign(book, updates);
  await book.save();

  return book;
};

const remove = async (bookId, userId) => {
  const book = await getBookByIdForUser(bookId, userId);
  await book.deleteOne();
};

export default { list, create, update, remove };
