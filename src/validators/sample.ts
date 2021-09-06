import Joi from 'joi';

export const createSchema = Joi.object({
    id: Joi.string().min(1).max(Number.MAX_SAFE_INTEGER),
    param: Joi.string().required(),
    justValue: Joi.number(),
});

export const editSchema = Joi.object({
    id: Joi.string().min(1).max(Number.MAX_SAFE_INTEGER),
    param: Joi.string(),
});
