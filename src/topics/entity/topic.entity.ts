import { User } from "src/users/entity/user.entity";
import { Column, Entity, OneToMany, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm";
@Entity({ name: 'topics' })
export class Topic {
    @PrimaryColumn()
    id: string;
    
    @Column()
    name: string;
    
    @Column()
    description : string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' }) 
    user_:User| string | null;

}

