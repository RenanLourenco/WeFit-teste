import { CustomError } from "./Custom.error";

export class MissingDataError extends CustomError {
    constructor(public message: string, public code: number){
        super(message, code)
        Object.setPrototypeOf(this, MissingDataError)
    }
}