import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<User> {
    const userExists = await this.userRepository.findOne({
      where: { email: registerUserDto.email },
    });
    if (userExists) {
      // throw new ConflictException('Email already exists');
      throw new BadRequestException('Email already exists');
    }
    const hashPassword = await this.hashPassword(registerUserDto.password);

    return await this.userRepository.save({
      ...registerUserDto,
      refresh_token: 'refresh_token_string',
      token: 'token_string',
      password: hashPassword,
    });
  }

  async login(loginUserDto: LoginUserDto): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email: loginUserDto.email },
    });
    if (!user) {
      throw new HttpException('Email is not exist', HttpStatus.UNAUTHORIZED);
    }
    const checkPass = bcrypt.compareSync(loginUserDto.password, user.password);
    if (!checkPass) {
      throw new HttpException(
        'Password is not correct',
        HttpStatus.UNAUTHORIZED,
      );
    }
    //generate access token and refresh token
    const payload = { id: user.id, email: user.email };
    return this.generateToken(payload);
  }

  private async generateToken(payload: { id: number; email: string }) {
    const token = await this.jwtService.signAsync(payload);
    const refresh_token = await this.jwtService.signAsync(payload, {
      // secret: this.configService.get<string>('SECRET'),
      // expiresIn: this.configService.get<string>('EXP_IN_REFRESH_TOKEN'),
      secret: 'thisissecretkey',
      expiresIn: '365d',
    });
    await this.userRepository.update(
      { email: payload.email },
      { refresh_token: refresh_token },
    );

    return { token, refresh_token };
  }
  private async hashPassword(password: string): Promise<string> {
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const hash = await bcrypt.hash(password, salt);

    return hash;
  }
}
