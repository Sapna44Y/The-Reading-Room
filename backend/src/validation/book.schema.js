import Joi from "joi";
import { READING_STATUS_VALUES } from "../constants/readingStatus.js";

const create = Joi.object({
  title: Joi.string().trim().min(1).max(300).required(),
  author: Joi.string().trim().min(1).max(200).required(),
  tags: Joi.array().items(Joi.string().trim().min(1)).default([]),
  status: Joi.string().valid(...READING_STATUS_VALUES),
});

const update = Joi.object({
  title: Joi.string().trim().min(1).max(300),
  author: Joi.string().trim().min(1).max(200),
  tags: Joi.array().items(Joi.string().trim().min(1)),
  status: Joi.string().valid(...READING_STATUS_VALUES),
}).min(1);

const query = Joi.object({
  status: Joi.string().valid(...READING_STATUS_VALUES),
  tag: Joi.string().trim(),
});

export default { create, update, query };
