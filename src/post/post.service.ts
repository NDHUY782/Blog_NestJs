import { BadRequestException, Body, Injectable } from '@nestjs/common';
import { Post } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async createPosts(
    userID: number,
    createPostDto: CreatePostDto,
  ): Promise<Post> {
    const user = await this.userRepository.findOneBy({
      id: userID,
    });

    try {
      const post = this.postRepository.create({
        ...createPostDto,
        user,
      });

      const result = await this.postRepository.save(post);
      return await this.postRepository.findOneBy({ id: result.id });
    } catch (error) {
      throw new BadRequestException('File is required');
    }
  }
}
