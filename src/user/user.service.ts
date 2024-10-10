import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Like, Repository, UpdateResult } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async findAll(query: FilterUserDto): Promise<any> {
    const items_per_page = Number(query.items_per_page) || 10;
    const page = Number(query.page) || 1;
    const skip = (page - 1) * items_per_page;
    const keyword = query.search || '';

    const [result, total] = await this.userRepository.findAndCount({
      where: [
        { first_name: Like('%' + keyword + '%') },
        { last_name: Like('%' + keyword + '%') },
        { email: Like('%' + keyword + '%') },
      ],
      order: { create_At: 'DESC' },
      take: items_per_page,
      skip: skip,
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
    const lastPage = Math.ceil(total / items_per_page);
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const prevPage = page - 1 < 1 ? null : page - 1;

    return {
      data: result,
      total,
      currentPage: page,
      nextPage,
      lastPage,
      prevPage,
    };
  }
  async getUserByID(id: number): Promise<User> {
    return await this.userRepository.findOneBy({ id });
  }
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const hashPassword = await bcrypt.hash(createUserDto.password, 10);
    const userExists = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (userExists) {
      throw new BadRequestException('Email already exists');
    }

    createUserDto.password = hashPassword;

    return await this.userRepository.save(createUserDto);
  }

  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> {
    return await this.userRepository.update(id, updateUserDto);
  }

  async deleteUser(id: number): Promise<DeleteResult> {
    return await this.userRepository.delete(id);
  }

  async updateAvatar(id: number, avatar: string): Promise<UpdateResult> {
    return await this.userRepository.update(id, { avatar });
  }
}
