import { IsString} from 'class-validator';

export class AssignRoleDto {

    @IsString()
    user_id: string;
    
    @IsString()
    role_id: string;

}