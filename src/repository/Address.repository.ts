import { Address } from "../domain/Address";
import { AppDataSource } from "../infra/data-source";

export const AddressRepo = AppDataSource.getRepository(Address)