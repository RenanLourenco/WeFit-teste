import Joi from "joi";


export const createContactValidator = Joi.object({
    cnpj: Joi.string().required().max(18),
    cpf: Joi.string().required().max(14),
    name: Joi.string().required(),
    mobile: Joi.string().required(),
    phone: Joi.string().required(),
    email: Joi.string().required().email(),
    confirmedEmail: Joi.string().required().email(),
    address: {
        zipCode: Joi.string().required(),
        streetAddress: Joi.string().required(),
        streetNumber: Joi.number().required(),
        streetAddressLine2: Joi.string(),
        city: Joi.string().required(),
        neighborhood: Joi.string().required(),
        state: Joi.string().required(),
    },
    terms: Joi.boolean().required()
})


export type CreateContactDTO = {
    cnpj: string,
    cpf: string,
    name: string,
    mobile: string,
    phone: string,
    email: string,
    confirmedEmail: string,
    address: {
        zipCode: string,
        streetAddress: string,
        streetNumber: number,
        streetAddressLine2?: string,
        city: string,
        neighborhood: string,
        state: string,
    },
    terms: boolean
}