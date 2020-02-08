import {Entity, Tree, TreeChildren, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany} from "typeorm";
import {Deliverer} from "./Deliverer"
import { type } from "os";
import {Merchant } from './Merchant'
import { Address } from "./Address";

@Entity()
@Tree("closure-table")
export class Delivery {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    status: string;

    // @Column()
    // phoneNumber: number;
    
    @ManyToOne(type => Deliverer, deliverer => deliverer.deliveries)
    deliverer: Deliverer;

    @ManyToOne(type => Merchant, merchant => merchant.deliveries)
    @TreeChildren()
    merchant: Merchant;

    @OneToMany(type => Address, address => address.delivery, {
        cascade: true
    })
    addresses: Address[];

}