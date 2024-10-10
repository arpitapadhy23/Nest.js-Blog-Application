import { Topic } from "src/topics/entity/topic.entity";
import { Column, Entity, PrimaryColumn, ManyToOne } from "typeorm";

@Entity({ name: 'blog'})

export class Blog{

    @PrimaryColumn()
    id : string;

    @Column()
    title: string

    @Column()
    description: string

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @ManyToOne(()=>Topic)
    topic_:Topic| string
}