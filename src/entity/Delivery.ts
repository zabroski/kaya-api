import {Entity, getManager, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany} from "typeorm";
import {Deliverer} from "./Deliverer"
import { type } from "os";
import {Merchant } from './Merchant'
import { Address } from "./Address";

@Entity()
export class Delivery {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    status: string;

    @Column()
    heart: string;
    
    @ManyToOne(type => Deliverer, deliverer => deliverer.deliveries)
    deliverer: Deliverer;

    @ManyToOne(type => Merchant, merchant => merchant.deliveries)
    merchant: Merchant;

    @OneToMany(type => Address, address => address.delivery, {
        cascade: true
    })
    addresses: Address[];

}

