import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryProvider } from 'helpers/cloudinary.config';
import { Post } from './entities/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Post]), ConfigModule],
  controllers: [PostController],
  providers: [PostService, CloudinaryProvider],
})
export class PostModule {}
