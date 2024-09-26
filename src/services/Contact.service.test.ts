import { Repository } from "typeorm";
import { ContactService, IContactService } from "../services/Contact.service";
import { Contact } from "../domain/Contact";
import { Address } from "../domain/Address";
import { CreateContactDTO } from "../controllers/dto/CreateContactDTO";
import { CustomError } from "../errors/Custom.error";

jest.mock("typeorm", () => ({
  ...jest.requireActual("typeorm"),
  Repository: jest.fn(),
}));

describe("ContactService", () => {
  let contactRepo: jest.Mocked<Repository<Contact>>;
  let addressRepo: jest.Mocked<Repository<Address>>;
  let contactService: IContactService;

  beforeEach(() => {
    contactRepo = {
      findOneBy: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    } as unknown as jest.Mocked<Repository<Contact>>;

    addressRepo = {
      create: jest.fn(),
      save: jest.fn(),
    } as unknown as jest.Mocked<Repository<Address>>;

    contactService = new ContactService(contactRepo, addressRepo);
  });

  it("deve cadastrar um novo contato com sucesso", async () => {
    const mockContact: CreateContactDTO = {
      cnpj: "12345678000100",
      cpf: "12345678900",
      email: "test@example.com",
      confirmedEmail: "test@example.com",
      mobile: "11987654321",
      phone: "1131234567",
      name: "Empresa Teste",
      terms: true,
      address: {
        city: "São Paulo",
        neighborhood: "Centro",
        state: "SP",
        streetAddress: "Rua Teste",
        streetAddressLine2: "Apto 1",
        streetNumber: 123,
        zipCode: "01001000",
      },
    };

    addressRepo.create.mockReturnValue(mockContact.address as any);
    addressRepo.save.mockResolvedValue(mockContact.address as any);
    contactRepo.create.mockReturnValue(mockContact as any);
    contactRepo.save.mockResolvedValue(mockContact as any);

    const result = await contactService.registerContact(mockContact);

    expect(result).toEqual(mockContact);
    expect(contactRepo.create).toHaveBeenCalledWith(expect.objectContaining({
        cnpj: "12345678000100",
        email: "test@example.com",
        mobile: "11987654321",
        name: "Empresa Teste",
        ownerCPF: "12345678900",
        phone: "1131234567",
        address: expect.objectContaining({
          city: "São Paulo",
          neighborhood: "Centro",
          state: "SP",
          streetAddress: "Rua Teste",
          streetAddressLine2: "Apto 1",
          streetNumber: 123,
          zipCode: "01001000",
        }),
      }));
    expect(contactRepo.save).toHaveBeenCalled();
    expect(addressRepo.create).toHaveBeenCalledWith(expect.objectContaining(mockContact.address));
    expect(addressRepo.save).toHaveBeenCalled();
  });

  it("deve lançar um CustomError ao ocorrer um erro durante o cadastro do contato", async () => {
    const mockContact: CreateContactDTO = {
      cnpj: "12345678000100",
      email: "test@example.com",
      confirmedEmail: "test@example.com",
      cpf: "12345678900",
      mobile: "11987654321",
      name: "Empresa Teste",
      phone: "1131234567",
      terms: true,
      address: {
        city: "São Paulo",
        neighborhood: "Centro",
        state: "SP",
        streetAddress: "Rua Teste",
        streetAddressLine2: "Apto 1",
        streetNumber: 123,
        zipCode: "01001000",
      },
    };

    addressRepo.save.mockRejectedValue(new Error("Erro ao salvar endereço"));

    await expect(contactService.registerContact(mockContact)).rejects.toThrow(CustomError);
    await expect(contactService.registerContact(mockContact)).rejects.toThrow("Erro ao salvar endereço");
  });
});
