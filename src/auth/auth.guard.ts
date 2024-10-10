import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { SuperAdmin } from 'src/superadmin/entity/superadmin.entity';
import { User } from 'src/users/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(SuperAdmin)
    private superAdminRepository: Repository<SuperAdmin>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const { authorization }: any = request.headers;
      if (!authorization) {
        throw new UnauthorizedException('Please provide token');
      }

      const decodedData = this.jwtService.verify(authorization, {
        secret: this.configService.get('JWT_SECRET'),
      });

      const superAdmin = await this.superAdminRepository.findOne({
        where: { id: decodedData.userId },
      });
      if (superAdmin) {
        request['id'] = decodedData.userId;
        return true;
      }

      const admin = await this.userRepository.findOne({
        where: { id: decodedData.userId },
      });

      if (admin && decodedData.roleId === 'R002') {
        request['id'] = decodedData.userId;
        return true;
      }

      return false;
    } catch (error) {
      throw new ForbiddenException(
        error.message || 'session expired! Please sign In',
      );
    }
  }
}
