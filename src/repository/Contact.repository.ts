import { Contact } from "../domain/Contact";
import { AppDataSource } from "../infra/data-source";

export const ContactRepo = AppDataSource.getRepository(Contact)