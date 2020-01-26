import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Deliverer {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    phoneNumber: number;

}