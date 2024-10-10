import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  Get,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { Topic } from './entity/topic.entity';
import { CreateTopicDto } from './dto/topic.dto';
import { request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { TopicService } from './topic.service';
import { CustomResponse } from 'src/utils/response';
import { TopicAccessDto } from './dto/topic-access.dto';

@Controller('topic')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @UseGuards(AuthGuard)
  @Post('create')
  async createTopic(@Body() createTopicDto: CreateTopicDto, @Req() request) {
    const autenticatedOwner = request['id'];

    const response = await this.topicService.createTopic(
      createTopicDto,
      autenticatedOwner,
    );

    return new CustomResponse(200, 'Topic created succesfully', response);
  }

  @UseGuards(AuthGuard)
  @Post('topic-relations')
  async topicUserRelation(
    @Body() topicAcessDto: TopicAccessDto,
    @Req() request,
  ) {
    const authenticatedOwner = request['id'];
    const response = await this.topicService.topicUserRelation(
      topicAcessDto,
      authenticatedOwner,
    );
    return new CustomResponse(200, 'Data inserted', response);
  }

  @Get('view-topics')
  async getAllTopics() {
    try {
      const topics = await this.topicService.getTopicDetails();
      return topics;
    } catch (error) {
      throw new NotFoundException('Topics not found');
    }
  }
}
