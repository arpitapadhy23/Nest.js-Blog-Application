import { IsString} from 'class-validator';

export class TopicAccessDto {

    @IsString()
    topic_:string

    @IsString()
    user_:string
    
    @IsString()
    role_: string;

}