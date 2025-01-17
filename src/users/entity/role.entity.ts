
import { Entity, Column, OneToMany, PrimaryColumn} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Role {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @OneToMany(() => User, user => user.role)
  users: User[];
}


