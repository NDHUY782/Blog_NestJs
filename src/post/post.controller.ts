import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'helpers/config';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @UseInterceptors(
    FileInterceptor('thumbnail', {
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
  @Post('')
  create(
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
    @Body() createPostDto: CreatePostDto,
  ) {
    console.log(createPostDto);
    console.log(req['user_data'].id);
    if (req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError);
    }
    if (!file) {
      throw new BadRequestException('File is required');
    }
    const imageUrl = file.path;
    console.log(imageUrl);
    return this.postService.createPosts(req['user_data'].id, {
      ...createPostDto,
      thumbnail: imageUrl,
    });
  }
}
