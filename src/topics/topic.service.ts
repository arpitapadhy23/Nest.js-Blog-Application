import { Repository } from 'typeorm';
import { Topic } from './entity/topic.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTopicDto } from './dto/topic.dto';
import { CustomError } from 'src/utils/response';
import { TopicAccess } from './entity/topic.access.entity';
import { TopicAccessDto } from './dto/topic-access.dto';
import { User } from 'src/users/entity/user.entity';
import { Role } from 'src/users/entity/role.entity';

@Injectable()
export class TopicService {
  constructor(
    @InjectRepository(Topic) private topicRepository: Repository<Topic>,
    @InjectRepository(TopicAccess)
    private topicAccessRepository: Repository<TopicAccess>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
  ) {}

  async createTopic(createTopicDto: CreateTopicDto, autenticatedOwner) {
    try {
      if (!autenticatedOwner) {
        throw new CustomError(400, 'Unauthorized user');
      }
      const { id } = createTopicDto;
      const topicData = this.topicRepository.create(createTopicDto);

      await this.topicRepository.save(topicData);

      const data = await this.topicRepository.findOne({ where: { id: id } });

      data.user_ = autenticatedOwner;

      await this.topicRepository.save(data);

      return data;
    } catch (error) {
      throw new CustomError(error.statusCode || 500, error.message);
    }
  }

  async topicUserRelation(topicAccessDto: TopicAccessDto, autenticatedOwner) {
    try {
      const topic = await this.topicRepository.findOne({
        where: { id: topicAccessDto.topic_ },
        relations: ['user_'],
      });
      const user = await this.userRepository.findOne({
        where: { id: topicAccessDto.user_ },
        relations: ['role'],
      });
      const role = await this.roleRepository.findOne({
        where: { id: topicAccessDto.role_ },
      });

      if (autenticatedOwner !== topic.user_['id']) {
        throw new CustomError(
          403,
          'you are not allowed to edit permissions for the topic',
        );
      }

      if (!user) {
        throw new CustomError(403, 'user not found');
      }
      const userRoleId = user.role['id'];

      if (!topic || !user || !role || userRoleId !== topicAccessDto.role_) {
        throw new CustomError(403, 'something went wrong with data ');
      }

      const data = this.topicAccessRepository.create(topicAccessDto);
      await this.topicAccessRepository.save(data);
      return data;
    } catch (error) {
      throw new CustomError(error.statusCode || 500, error.message);
    }
  }

  async getTopicDetails(): Promise<Topic[]> {
    const topic = await this.topicRepository
      .createQueryBuilder('topic')
      .innerJoinAndSelect('topic.user_', 'user')
      .select([
        'topic.id',
        'topic.name',
        'topic.description',
        'topic.createdAt',
        'user.id',
        'user.name',
      ]) 
      .getMany();

    if (!topic) {
      throw new NotFoundException('User not found');
    }

    return topic;
  }
}
