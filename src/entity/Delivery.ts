import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";
import {Deliverer} from "./Deliverer"
import { type } from "os";

@Entity()
export class Delivery {

    @PrimaryGeneratedColumn()
    id: number;

    // @Column()
    // phoneNumber: number;
    @ManyToOne(type => Deliverer, deliverer => deliverer.deliveries)
    deliverer: Deliverer;

}