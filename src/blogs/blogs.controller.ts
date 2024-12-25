import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogDto } from './dto/blogs.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  createBlog(@Body() dto: BlogDto, @Request() req: any): Promise<any> {
    return this.blogsService.createBlog(dto, req);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  updateBlog(@Body() dto: BlogDto, @Param('id') id: string): Promise<any> {
    return this.blogsService.updateBlog(dto, id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  deleteBlog(@Body() dto: BlogDto, @Param('id') id: string): Promise<any> {
    return this.blogsService.deleteBlog(dto, id);
  }

  @Get()
  getAllBlogs(): Promise<BlogDto[]> {
    return this.blogsService.getAllBlogs();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('my-blogs')
  getMyBlogs(@Request() req: any): Promise<BlogDto[]> {
    return this.blogsService.getMyBlogs(req);
  }
}
