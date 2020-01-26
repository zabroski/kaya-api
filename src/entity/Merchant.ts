import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import {Delivery} from './Delivery'
@Entity()
export class Merchant {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    // @Column()
    // phoneNumber: number;

    @OneToMany(type => Delivery, delivery => delivery.merchant)
    deliveries: Delivery[];

}