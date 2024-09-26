import { Router } from "express";
import { ContactService } from "../services/Contact.service";
import { AddressRepo } from "../repository/Address.repository";
import { ContactRepo } from "../repository/Contact.repository";
import { ContactController } from "../controllers/Contact.controller";

const routes = Router()

const contactService = new ContactService(ContactRepo, AddressRepo)
const contactController = new ContactController(contactService)


routes.post("/pj/register", contactController.register.bind(contactController))

export { routes }