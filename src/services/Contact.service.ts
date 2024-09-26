import { Repository } from "typeorm";
import { Contact } from "../domain/Contact";
import { Address } from "../domain/Address";
import { CreateContactDTO } from "../controllers/dto/CreateContactDTO";
import { CustomError } from "../errors/Custom.error";

export interface IContactService {
    registerContact(data: CreateContactDTO): Promise<Contact>
    findByCnpj(cnpj: string): Promise<Contact | null>
}

export class ContactService implements IContactService {
    constructor(
        private contactRepo: Repository<Contact>,
        private addressRepo: Repository<Address>,
    ) { }

    async findByCnpj(cnpj: string): Promise<Contact | null> {
        return await this.contactRepo.findOneBy({ cnpj })
    }

    async registerContact(data: CreateContactDTO): Promise<Contact> {
        const { address } = data;
        try {
            
            let add = this.addressRepo.create({
                city: address.city,
                neighborhood: address.neighborhood,
                state: address.state,
                streetAddress: address.streetAddress,
                streetAddressLine2: address.streetAddressLine2,
                streetNumber: address.streetNumber,
                zipCode: address.zipCode,
            })
            add = await this.addressRepo.save(add);

            const contact = this.contactRepo.create({
                cnpj: data.cnpj,
                email: data.email,
                mobile: data.mobile,
                name: data.name,
                ownerCPF: data.cpf,
                phone: data.phone,
                address: add,
            })

            return await this.contactRepo.save(contact);


        } catch (error: any) {
            console.log(error);
            throw new CustomError(error.message, 500)
        }
    }

}