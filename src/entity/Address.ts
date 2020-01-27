import {Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne} from "typeorm";
import {Delivery} from './Delivery'


@Entity()
export class Address {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    type: string;

    @Column()
    street: string;

    @Column()
    zipCode: string;

    @Column()
    country: string;

    @Column()
    city: string;
    

    @ManyToOne(type => Delivery, delivery => delivery.addresses)
    delivery :Delivery;

}