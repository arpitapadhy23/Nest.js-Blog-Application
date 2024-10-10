import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { User } from './users/entity/user.entity';
import { Role } from './users/entity/role.entity';
import { UserModule } from './users/user.module';
import { Topic } from './topics/entity/topic.entity';
import { SuperAdmin } from './superadmin/entity/superadmin.entity';
import { Blog } from './blogs/entity/blogs.entity';
import { TopicAccess } from './topics/entity/topic.access.entity';
import { BlogAccess } from './blogs/entity/blog.access.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuperAdminModule } from './superadmin/superadmin.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TopicModule } from './topics/topic.module';
import { BlogModule } from './blogs/blog.module';
import { APP_FILTER } from '@nestjs/core';
import { CustomError } from './utils/response';
import { LoginModule } from './auth/login/login.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [User, Role, Topic, SuperAdmin, Blog, TopicAccess, BlogAccess],
      synchronize: true,
    }),
    UserModule,
    SuperAdminModule,
    TopicModule,
    BlogModule,
    LoginModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: CustomError,
    },
  ],
})
export class AppModule {}
