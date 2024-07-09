const Joi = require('joi');
const { encrypt } = require('../encryption/generateEncryption');

const dataToSave = {
    origemTag: 'origem',
    origemName:'name',
    LoggedUser: 'User Logged',
    OrigemLogin: 'User Password Origem Login',
    plainPassword: 'userPassword' 
}

const EncryptedPassword = encrypt(dataToSave.plainPassword);

const UserPasswordSchema = Joi.object({
    origemTag: Joi.string().required(),
    origemName:Joi.string().required(),
    LoggedUser: Joi.string().required(),
    OrigemLogin: Joi.string().required(),
    EncryptedPassword: Joi.string().required(), 
});

const dataToValidate = {
    LoggedUser: dataToSave.LoggedUser,
    OrigemLogin: dataToSave.OrigemLogin,
    EncryptedPassword: EncryptedPassword,
};

const validate = (data) => {
    return UserPasswordSchema.validate(data);
};

const { error, value } = validate(dataToValidate);

//if (error) {
  //  console.log('Validation Error:', error.details);
//} else {
  //  console.log('Validated Data:', value);
//}

module.exports = { UserPasswordSchema, validate };