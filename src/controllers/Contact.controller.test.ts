import { Request, Response, NextFunction } from 'express';
import { IContactService } from '../services/Contact.service';
import { ViaCepProvider } from '../provider/via-cep';
import { CreateContactDTO } from '../controllers/dto/CreateContactDTO';
import { CustomError } from '../errors/Custom.error';
import { MissingDataError } from '../errors/MissingData.error';
import { ContactController } from './Contact.controller';

jest.mock('../services/Contact.service');
jest.mock('../provider/via-cep');

describe('ContactController', () => {
    let contactService: jest.Mocked<IContactService>;
    let contactController: ContactController;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        // Mock do serviço
        contactService = {
            findByCnpj: jest.fn(),
            registerContact: jest.fn(),
        } as unknown as jest.Mocked<IContactService>;

        // Instanciando o controller
        contactController = new ContactController(contactService);

        // Mock do objeto Request, Response e NextFunction
        mockRequest = {
            body: {
                "cnpj": "66.053.129/0001-76",
                "cpf": "092.590.590-97",
                "name": "Brenda e Jéssica Limpeza ME",
                "mobile": "(11) 98322-1061",
                "phone": "(11) 2690-9575",
                "email": "marketing@brendaejessicalimpezame.com.br",
                "confirmedEmail": "marketing@brendaejessicalimpezame.com.br",
                "address": {
                    "zipCode": "01001000",
                    "streetAddress": "Praça da sé",
                    "streetAddressLine2": "lado impar",
                    "neighborhood": "Sé",
                    "state": "São Paulo",
                    "city": "São Paulo",
                    "streetNumber": 33
                },
                "terms": true
            } as CreateContactDTO,
        };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        mockNext = jest.fn();

        // Mock da função do ViaCepProvider
        (ViaCepProvider.validateCEP as jest.Mock).mockResolvedValue(true);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('deve cadastrar um novo contato com sucesso', async () => {
        mockRequest.body = {
            ...mockRequest.body,
            cnpj: mockRequest.body.cnpj.replace(/[^\d]/g, ''),
            cpf: mockRequest.body.cpf.replace(/[^\d]/g, ''),
            mobile: mockRequest.body.mobile.replace(/[^\d]/g, ''),
            phone: mockRequest.body.phone.replace(/[^\d]/g, ''),
        };
        contactService.findByCnpj.mockResolvedValue(null);
        contactService.registerContact.mockResolvedValue({ id: 1, ...mockRequest.body });

        await contactController.register(mockRequest as Request, mockResponse as Response, mockNext);



        expect(mockResponse.status).toHaveBeenCalledWith(200);

        

        const expectedResponse = {
            success: true,
            contact: {
                id: 1,
                ...mockRequest.body,
            }
        };
    
        expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
    });

    it('deve retornar erro se o CEP for inválido', async () => {
        (ViaCepProvider.validateCEP as jest.Mock).mockResolvedValue(false);

        await expect(contactController.register(mockRequest as Request, mockResponse as Response, mockNext))
            .rejects.toThrow(CustomError);

        expect(mockNext).not.toHaveBeenCalled();
    });

    it('deve retornar erro se o email confirmado não for igual ao email', async () => {
        mockRequest.body.confirmedEmail = 'different@example.com';

        await expect(contactController.register(mockRequest as Request, mockResponse as Response, mockNext))
            .rejects.toThrow(CustomError);

        expect(mockNext).not.toHaveBeenCalled();
    });

    it('deve retornar erro se o contato já existir', async () => {
        contactService.findByCnpj.mockResolvedValue(mockRequest.body);

        await expect(contactController.register(mockRequest as Request, mockResponse as Response, mockNext))
            .rejects.toThrow(CustomError);

        expect(contactService.findByCnpj).toHaveBeenCalledWith(mockRequest.body.cnpj);
    });

    it('deve retornar erro caso os termos não sejam aceitos', async () => {
        mockRequest.body.terms = false;

        await expect(contactController.register(mockRequest as Request, mockResponse as Response, mockNext))
            .rejects.toThrow(CustomError);
    });
});
