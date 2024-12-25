import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from './schemas/blog.schema';
import { Model } from 'mongoose';
import { BlogDto } from './dto/blogs.dto';
import { User, UserDocument } from 'src/auth/schemas/user.schema';

@Injectable()
export class BlogsService {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async createBlog(dto: BlogDto, req: any): Promise<Blog> {
    const user = await this.userModel.findOne({ email: req.user.email });

    const newBlog = new this.blogModel({
      title: dto.title,
      content: dto.content,
      sharedBy: user.email,
      userID: user._id,
    });

    return await newBlog.save();
  }

  async updateBlog(dto: BlogDto, id: string): Promise<Blog> {
    const blog = await this.blogModel.findById(id);

    if (!blog) {
      throw new Error('There is no blog with this id');
    }

    if (dto.userID !== blog.userID.toString()) {
      throw new UnauthorizedException('You cannot update this blog!');
    }

    return await this.blogModel.findByIdAndUpdate(id, dto, { new: true });
  }

  async deleteBlog(dto: BlogDto, id: string): Promise<Blog> {
    const blog = await this.blogModel.findById(id);
    if (!blog) {
      throw new Error('There is no blog with this id');
    }

    if (dto.userID !== blog.userID.toString()) {
      throw new UnauthorizedException('You cannot delete this blog!');
    }

    return await this.blogModel.findByIdAndDelete(id);
  }

  async getAllBlogs(): Promise<Blog[]> {
    return await this.blogModel.find();
  }

  async getMyBlogs(req: any): Promise<Blog[]> {
    const currentUser = await this.userModel.findOne({ email: req.user.email });
    return await this.blogModel.find({ userID: currentUser._id });
  }
}
