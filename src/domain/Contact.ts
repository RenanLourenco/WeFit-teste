import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Address } from "./Address";


@Entity("contacts")
export class Contact {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: 'varchar', nullable: false, unique: true})
    cnpj: string

    @Column({name:"owner_cpf",type: 'varchar', nullable: false})
    ownerCPF: string

    @Column({type: 'varchar', nullable: false})
    name: string
    
    @Column({type: 'varchar', nullable: false})
    mobile: string

    @Column({type: 'varchar', nullable: false})
    phone: string

    @Column({type: 'varchar', nullable: false, unique: true})
    email: string

    @OneToOne(() => Address, {cascade: true})
    @JoinColumn()
    address: Address
}