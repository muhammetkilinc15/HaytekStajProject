import Joi from 'joi';

export const categoryValidator = Joi.object({
    name: Joi.string().required()
});
