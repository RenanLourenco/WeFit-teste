import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Contact } from "./Contact";

@Entity("addresses")
export class Address{
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: 'varchar', nullable: false})
    zipCode: string

    @Column({type: 'varchar', nullable: false})
    streetAddress: string

    @Column({type: 'int', nullable: false})
    streetNumber: number

    @Column({type: 'varchar', nullable: true})
    streetAddressLine2: string

    @Column({type: 'varchar', nullable: false})
    city: string

    @Column({type: 'varchar', nullable: false})
    neighborhood: string

    @Column({type: 'varchar', nullable: false})
    state: string


}