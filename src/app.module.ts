import { Injectable, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'db/data-source';
import { AuthModule } from './auth/auth.module';
import { Repository } from 'typeorm';
import { User } from './user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOptions), UserModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
}
