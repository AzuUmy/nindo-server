
const Joi = require('joi');

const creatAccountSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    birthDate: Joi.number().required(),
    telNumber: Joi.number().required(),
    password: Joi.string().required(),
    userImage: Joi.string().required()
});

const validate = (data) => {
    return creatAccountSchema.validate(data);
};

module.exports = {creatAccountSchema, validate};