import { Injectable } from '@nestjs/common';
import { LoginUserDto } from './dto/superadmin.dto';
import { SuperAdmin } from './entity/superadmin.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { CustomError } from 'src/utils/response';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entity/user.entity';
import { AssignRoleDto } from './dto/assign-roles.dto';
import { hashPassword } from '../utils/hashing';

@Injectable()
export class SuperAdminService {
  constructor(
    @InjectRepository(SuperAdmin)
    private superAdminRepository: Repository<SuperAdmin>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async loginSuperAdmin(loginUserDto: LoginUserDto) {
    try {
      loginUserDto.password = hashPassword(loginUserDto.password);

      const { email } = loginUserDto;
      let user = await this.superAdminRepository.findOne({ where: { email } });

      if (!user || loginUserDto.password != user.password) {
        throw new CustomError(403, 'Email or Password is incorrect');
      } else {
        const token = this.jwtService.sign({
          userId: user.id,
          roleId: user.role_id,
        });
        return token;
      }
    } catch (error) {
      throw new CustomError(error.status || 500, error.message);
    }
  }

  async assignRoles(assignRoleDto: AssignRoleDto) {
    try {
      const { user_id, role_id } = assignRoleDto;

      const updateResult = await this.userRepository.update(user_id, {
        role: role_id,
      });

      if (updateResult.affected === 0) {
        throw new CustomError(403, 'No User Found or no changes applied');
      }

      const user = await this.userRepository.findOne({
        where: { id: user_id },
      });

      return user;
    } catch (error) {
      throw new CustomError(error.status || 500, error.message);
    }
  }
}
