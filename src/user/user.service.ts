import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      select: [
        'id',
        'email',
        'first_name',
        'last_name',
        'status',
        'create_At',
        'update_At',
      ],
    });
  }
}
