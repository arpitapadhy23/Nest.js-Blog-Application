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
import { TopicAccess } from 'src/topics/entity/topic.access.entity';
//import { SuperAdmin } from 'src/superadmin/superadmin.entity';
import { User } from 'src/users/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthBlogGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
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

      if (decodedData.roleId === 'R003') {
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
