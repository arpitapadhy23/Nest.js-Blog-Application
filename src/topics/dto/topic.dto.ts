import { IsString,  IsOptional } from 'class-validator';

export class CreateTopicDto {

    @IsString()
    id: string;
    
    @IsString()
    name:string

    @IsString()
    description: string

    @IsString()
    @IsOptional()
    user?: string;

}