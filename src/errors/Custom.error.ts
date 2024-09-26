export class CustomError extends Error {
    public statusCode: number
    constructor(public message: string, public code: number){
        super(message)
        this.statusCode = code
        Object.setPrototypeOf(this, new.target.prototype);
    }
}