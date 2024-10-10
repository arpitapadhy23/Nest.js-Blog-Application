import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../users/entity/user.entity';
import { CustomResponse, CustomError } from '../../utils/response';
import * as md5 from 'md5';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { LoginUserDto } from 'src/superadmin/dto/superadmin.dto';
import { hashPassword } from '../../utils/hashing';

@Injectable()
export class LoginService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async loginUser(loginUserDto: LoginUserDto) {
    try {
      const { email } = loginUserDto;

      loginUserDto.password = hashPassword(loginUserDto.password);

      let user = await this.userRepository.findOne({
        where: { email: email, password: loginUserDto.password },
        relations: ['role'],
      });

      if (!user) {
        throw new CustomError(403, 'Email or Password is incorrect');
      }

      const token = await this.jwtService.sign({
        userId: user.id,
        roleId: user.role['id'],
      });

      return token;
    } catch (error) {
      throw new CustomError(error.status || 500, error.message);
    }
  }
}
