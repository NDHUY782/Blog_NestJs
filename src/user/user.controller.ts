import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  Request,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'helpers/config';
import { extname } from 'path';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Query() query: FilterUserDto): Promise<User[]> {
    console.log(query);
    return this.userService.findAll(query);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  getUserByID(@Param('id') id: string): Promise<User> {
    return this.userService.getUserByID(Number(id));
  }

  // @UseGuards(AuthGuard)
  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.createUser(createUserDto);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(Number(id), updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.userService.deleteUser(Number(id));
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: storageConfig,
      fileFilter: (req, file, cb) => {
        const ext = file.originalname.split('.').pop();
        const allowedExtArr = ['jpg', 'jpeg', 'png'];
        if (!allowedExtArr.includes(ext)) {
          req.fileValidationError = `Wrong file type. Accepted: ${allowedExtArr.join(', ')}`;
          cb(null, false);
        } else {
          const fileSize = parseInt(req.headers['content-length']);
          if (fileSize > 1024 * 1024 * 5) {
            req.fileValidationError =
              'File size too large. Accepted file less than 5MB';
            cb(null, false);
          } else {
            cb(null, true);
          }
        }
      },
    }),
  )
  @Post('/upload-avatar')
  async uploadAvatar(
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError);
    }
    if (!file) {
      throw new BadRequestException('File is required');
    }
    const imageUrl = file.path;
    return await this.userService.updateAvatar(req.user_data.id, imageUrl);
  }
  // @UseInterceptors(
  //   FileInterceptor('avatar', {
  //     storage: storageConfig_local('avatar'),
  //     fileFilter: (req, file, cb) => {
  //       const ext = extname(file.originalname);
  //       const allowedExtArr = ['.jpg', '.png', '.jpeg'];
  //       if (!allowedExtArr.includes(ext)) {
  //         req.fileValidationError = `Wrong ext type. Accepted: ${allowedExtArr.toString()}`;
  //         cb(null, false);
  //       } else {
  //         const fileSize = parseInt(req.headers['content-length']);
  //         if (fileSize > 1024 * 1024 * 5) {
  //           req.fileValidationError =
  //             'Size too large. Accepted  file less than 5MB}';
  //           cb(null, false);
  //         } else {
  //           cb(null, true);
  //         }
  //       }
  //     },
  //   }),
  // )
  // @Post('/upload-avatar')
  // uploadAvatar(@Req() req: any, @UploadedFile() file: Express.Multer.File) {
  //   if (req.fileValidationError) {
  //     throw new BadRequestException(req.fileValidationError);
  //   }
  //   if (!file) {
  //     throw new BadRequestException('File is required');
  //   }
  //   return this.userService.updateAvatar(
  //     req.user_data.id,
  //     file.destination + '/' + file.filename,
  //   );
  // }
}
