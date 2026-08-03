const STATUSES = ["want_to_read", "reading", "completed"];

export const READING_STATUS = Object.freeze(
  STATUSES.reduce((acc, status) => {
    acc[status.toUpperCase()] = status;
    return acc;
  }, {}),
);

export const READING_STATUS_VALUES = Object.freeze(STATUSES);
