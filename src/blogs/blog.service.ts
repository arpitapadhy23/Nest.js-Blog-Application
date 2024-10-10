import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomError } from '../utils/response';
import { Blog } from './entity/blogs.entity';
import { CreateBlogDto } from './dto/blog.dto';
import { Topic } from 'src/topics/entity/topic.entity';
import { TopicAccess } from 'src/topics/entity/topic.access.entity';
import { BlogAccess } from './entity/blog.access.entity';

@Injectable()
export class blogService {
  constructor(
    @InjectRepository(Blog) private readonly blogRepository: Repository<Blog>,
    @InjectRepository(Topic)
    private readonly topicRepository: Repository<Topic>,
    @InjectRepository(TopicAccess)
    private topicAccessRepository: Repository<TopicAccess>,
    @InjectRepository(BlogAccess)
    private blogAccessRepository: Repository<BlogAccess>,
  ) {}

  async createBlog(createBLogDto: CreateBlogDto, authenticatedPerson) {
    const { id, topic_id } = createBLogDto;
    try {
      const topic = await this.topicRepository.findOne({
        where: { id: topic_id },
      });

      if (!topic) {
        throw new CustomError(404, 'Topic not found!');
      }

      const authorizationData = await this.topicAccessRepository.find({
        where: { topic_: { id: topic_id } },
        relations: ['topic_', 'user_', 'role_'],
      });

      const authorizedPerson = authorizationData[0].user_['id'];

      if (authorizedPerson !== authenticatedPerson) {
        throw new CustomError(
          404,
          'You are not allowed to create or edit a blog of this topic ',
        );
      }

      const createBlog = await this.blogRepository.create(createBLogDto);
      await this.blogRepository.insert(createBlog);

      const data = await this.blogRepository.findOne({ where: { id: id } });

      data.topic_ = topic_id;

      const createBlogAccessData = this.blogAccessRepository.create({
        topic_: topic_id,
        user_: authorizedPerson,
        blog_: id,
      });
      await this.blogAccessRepository.save(createBlogAccessData);

      return await this.blogRepository.save(data);
    } catch (error) {
      throw new CustomError(error.statusCode || 500, error.message);
    }
  }

  async updateBlog(updateBlog: CreateBlogDto, authenticatedPerson) {
    try {
      const { id, title, description } = updateBlog;

      const blog = await this.blogRepository.findOne({ where: { id: id } });
      if (!blog) {
        throw new CustomError(404, 'blog not found!');
      }

      const authorizedData = await this.blogAccessRepository.find({
        where: { blog_: { id: id } },
        relations: ['topic_', 'user_', 'blog_'],
      });

      const authorizedPerson = authorizedData[0].user_['id'];

      if (authorizedPerson !== authenticatedPerson) {
        throw new CustomError(404, 'unauthorized acsess');
      }

      const updatedBlog = await this.blogRepository
        .createQueryBuilder()
        .update(Blog)
        .set({ title: title, description: description })
        .where('id = :id', { id: id })
        .execute();

      return updatedBlog;
    } catch (error) {
      throw new CustomError(error.statusCode || 500, error.message);
    }
  }

  async deleteBlog(deleteBLogId: string, authenticatedPerson) {
    try {
      const id = deleteBLogId;
      const blog = await this.blogRepository.findOne({ where: { id: id } });
      if (!blog) {
        throw new CustomError(404, 'blog not found!');
      }
      const authorizedData = await this.blogAccessRepository.find({
        where: { blog_: { id: id } },
        relations: ['topic_', 'user_', 'blog_'],
      });

      const authorizedTopic = authorizedData[0].topic_['id'];

      const data = await this.topicRepository.find({
        where: { id: authorizedTopic },
        relations: ['user_'],
      });

      const authorizedPerson = data[0].user_['id'];

      if (authorizedPerson !== authenticatedPerson) {
        throw new CustomError(404, 'unauthorized access!');
      }

      await this.blogAccessRepository.delete({ blog_: id });

      const deletedBlog = await this.blogRepository
        .createQueryBuilder()
        .delete()
        .where('id = :id', { id: id })
        .execute();

      return deletedBlog;
    } catch (error) {
      throw new CustomError(error.statusCode || 500, error.message);
    }
  }
}
