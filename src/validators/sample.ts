import Joi from 'joi';

const createSchema = Joi.object({
    id: Joi.string().min(1).max(Number.MAX_SAFE_INTEGER),
    param: Joi.string().required(),
    justValue: Joi.number()
});

const editSchema = Joi.object({
    id: Joi.string().min(1).max(Number.MAX_SAFE_INTEGER),
    param: Joi.string(),
});

export = { createSchema, editSchema }
