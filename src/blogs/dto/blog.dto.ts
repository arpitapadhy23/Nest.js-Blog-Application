import { IsOptional, IsString } from "class-validator";

export class CreateBlogDto {

       @IsString()
       id: string;

       @IsString()
       title: string;

       @IsString()
       description: string;

       @IsString()
       topic_id: string;

}