import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { LoginUserDto } from './dto/superadmin.dto';
import { SuperAdminService } from './superadmin.service';
import { CustomError, CustomResponse } from 'src/utils/response';
import { AssignRoleDto } from './dto/assign-roles.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('super')
export class SuperAdminController {
  constructor(private readonly loginSuperAdminService: SuperAdminService) {}

  @Post('login')
  async loginSuperAdmin(@Body() loginUserDto: LoginUserDto) {
    const token =
      await this.loginSuperAdminService.loginSuperAdmin(loginUserDto);

    if (!token) {
      throw new CustomError(404, 'failed to generate token');
    }

    return new CustomResponse(200, 'successfully logged in', token);
  }

  @UseGuards(AuthGuard)
  @Post('assign-roles')
  async assignRoles(@Body() assignRoleDto: AssignRoleDto) {
    const response =
      await this.loginSuperAdminService.assignRoles(assignRoleDto);

    if (!response) {
      throw new CustomError(404, 'Failed to assign roles');
    }

    return new CustomResponse(200, 'Successfully assigned roles', response);
  }
}
