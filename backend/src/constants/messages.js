export const MESSAGES = Object.freeze({
  AUTH: Object.freeze({
    SIGNUP_SUCCESS: "User registered successfully",
    LOGIN_SUCCESS: "Login successful",
    LOGOUT_SUCCESS: "Logout successful",
    EMAIL_IN_USE: "Email is already registered",
    INVALID_CREDENTIALS: "Invalid email or password",
    UNAUTHORIZED: "Authentication required",
    TOKEN_INVALID: "Invalid or expired token",
  }),
  BOOK: Object.freeze({
    CREATED: "Book added successfully",
    UPDATED: "Book updated successfully",
    DELETED: "Book deleted successfully",
    FETCHED: "Books fetched successfully",
    NOT_FOUND: "Book not found",
    FORBIDDEN: "You do not have access to this book",
  }),
  DASHBOARD: Object.freeze({
    FETCHED: "Dashboard stats fetched successfully",
  }),
  COMMON: Object.freeze({
    VALIDATION_ERROR: "Validation failed",
    SERVER_ERROR: "Something went wrong. Please try again later",
    ROUTE_NOT_FOUND: "Route not found",
  }),
});
