import Joi from "joi";

export const createBlogValidator = Joi.object({
    title: Joi.string().required(),
    subtitle: Joi.string().required(),
    content: Joi.string().required(),
    userId: Joi.number().required(),
    mainPage: Joi.boolean().required(),
    isApproved: Joi.boolean().required(),
});

export const updateBlogValidator = Joi.object({
    title: Joi.string().required(),
    subtitle: Joi.string().required(),
    content: Joi.string().required(),
    image: Joi.string().required(),
    userId: Joi.number().required(),
});

export const addBlogCategoryValidator = Joi.object({
    blogId: Joi.number().required(),
    categoryId: Joi.number().required(),
});

export const deleteBlogValidator = Joi.object({
    id: Joi.number().required(),
});

export const getByUrlBlogValidator = Joi.object({
    url: Joi.string().required(),
});
