import { NextFunction, Request, Response } from "express";
import { IContactService } from "../services/Contact.service";
import { CreateContactDTO, createContactValidator } from "./dto/CreateContactDTO";
import { MissingDataError } from "../errors/MissingData.error";
import { CustomError } from "../errors/Custom.error";
import { ViaCepProvider } from "../provider/via-cep";

export class ContactController {
    constructor(private contactService: IContactService) { }

    async register(req: Request, res: Response, next: NextFunction) {
        let data = req.body as CreateContactDTO

        const { error } = createContactValidator.validate(data);

        if (error) {
            throw new MissingDataError(error.message, 400)
        }

        //validate terms

        if (!data.terms) {
            throw new CustomError("terms should be accepted", 400)
        }

        //validate cep

        data.address.zipCode = data.address.zipCode.replace(/[^\d]/g, '')

        const validated = await ViaCepProvider.validateCEP(data.address.zipCode);

        if (!validated) {
            throw new CustomError("invalid zip code", 400);
        }

        //verify special digits
        data.cpf = data.cpf.replace(/[^\d]/g, '')
        data.cnpj = data.cnpj.replace(/[^\d]/g, '')
        data.mobile = data.mobile.replace(/[^\d]/g, '')
        data.phone = data.phone.replace(/[^\d]/g, '')


        if (data.email != data.confirmedEmail) {
            throw new CustomError("wrong confirmed email", 400)
        }
        
        const checkIfAlreadyExists = await this.contactService.findByCnpj(data.cnpj)

        
        if (checkIfAlreadyExists) {
            throw new CustomError("contact already exists", 400)
        }

        const register = await this.contactService.registerContact(data);


        return res.status(200).json({
            success: true,
            contact: register,
        })
    }
}