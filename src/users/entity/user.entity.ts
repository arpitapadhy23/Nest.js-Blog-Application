import { Entity, PrimaryColumn, Column, ManyToOne ,Unique} from 'typeorm';
import { Role } from './role.entity';

@Entity()
export class User {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @ManyToOne(() => Role)
  role: string;
}
