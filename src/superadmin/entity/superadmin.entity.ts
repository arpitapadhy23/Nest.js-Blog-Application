import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: 'superadmin'})

export class SuperAdmin{
    @PrimaryColumn()
    id : string;
    @Column()
    name: string
    @Column()
    email: string
    @Column()
    password: string
    @Column()
    role_id:string
}