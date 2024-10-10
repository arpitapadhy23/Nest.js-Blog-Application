import { Entity , OneToOne, JoinColumn, PrimaryGeneratedColumn, ManyToMany, ManyToOne} from 'typeorm';
import { Topic } from './topic.entity';
import { Role } from 'src/users/entity/role.entity';
import { User } from 'src/users/entity/user.entity';


@Entity()
export class TopicAccess {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(()=> Topic)
  @JoinColumn({ name: 'topic_id' })
  topic_:Topic | string;

  @ManyToOne(()=> User)
  @JoinColumn({ name: 'user_id' })
  user_: User |string;

  @ManyToOne(()=> Role)
  @JoinColumn({ name: 'role_id' })
  role_:Role | string;
}
