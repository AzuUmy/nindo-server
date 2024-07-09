const Joi = require('joi');

const origemSchema = Joi.object({
    image: Joi.string().required(),
    name: Joi.string().required(),
});

const validate = (data) => {
    return origemSchema.validate(data);
};

module.exports = { origemSchema, validate };