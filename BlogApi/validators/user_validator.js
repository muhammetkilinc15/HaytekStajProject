// src/validators/userValidator.js
import Joi from 'joi';

export const registerValidator = (data) => {
    const schema = Joi.object({
        username: Joi.string().min(3).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    });
    return schema.validate(data);
};

export const loginValidator = (data) => {
    const schema = Joi.object({
        emailOrUsername: Joi.string().required(),
        password: Joi.string().required(),
    });
    return schema.validate(data);
};

