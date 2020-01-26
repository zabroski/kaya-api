import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

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

}