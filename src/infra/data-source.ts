import 'reflect-metadata'
import 'dotenv/config'
import { DataSource } from 'typeorm'
import { Contact } from '../domain/Contact'
import { Address } from '../domain/Address'


const port = process.env.DB_PORT  || 3306

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: "localhost",
    port: port as number,
    username: "root",
    password: process.env.MYSQLDB_PASSWORD,
    database: process.env.MYSQLDB_DATABASE,
    //TODO change to migration, is not a good practice to syncronize our code with database (directly)
    entities: [Contact, Address],
    synchronize: true,
})

