import { IsNotEmpty, IsEmail } from 'class-validator';
import { Role } from '../entity/role.entity';

export class CreateUserDto {

  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  role: string;

}