import {
  Controller,
  Post,
  Body,
  
  UsePipes,
} from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginUserDto } from 'src/superadmin/dto/superadmin.dto';
import { CustomError, CustomResponse } from 'src/utils/response';

@Controller('users')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post('login')
  async loginUser(@Body() loginUserDto: LoginUserDto) {
    const token = await this.loginService.loginUser(loginUserDto);
    if (!token) {
      throw new CustomError(404, 'failed to generate token');
    }

    return new CustomResponse(200, 'successfully logged in', token);
  }
}
