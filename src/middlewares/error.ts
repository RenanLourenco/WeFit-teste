import {ErrorRequestHandler, NextFunction, Request, Response} from 'express'
import { CustomError } from '../errors/Custom.error'


export const errorMiddleware: ErrorRequestHandler = (
    error:  Error & Partial<CustomError>,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const statusCode = error.statusCode ?? 500
    return res.status(statusCode).json({ error: true, message: error.message})
}