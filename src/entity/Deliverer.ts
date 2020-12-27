import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import { Delivery } from "./Delivery";
import { type } from "os";

@Entity()
export class Deliverer {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

 

    

    // @Column()
    // phoneNumber: number;

    @OneToMany(type => Delivery, delivery => delivery.deliverer)
    deliveries: Delivery[];

}