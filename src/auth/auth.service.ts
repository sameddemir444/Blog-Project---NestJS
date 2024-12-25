import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(dto: AuthDto) {
    const hashedpassword = await bcrypt.hash(dto.password, 10);
    const newUser = new this.userModel({
      email: dto.email,
      password: hashedpassword,
    });

    const user = await newUser.save();
    return this.createToken(user.email);
  }

  async login(dto: AuthDto) {
    const emailCheck = await this.userModel.findOne({ email: dto.email });
    if (!emailCheck) {
      throw new UnauthorizedException('Wrong email');
    }

    const passwordCheck = await bcrypt.compare(
      dto.password,
      emailCheck.password,
    );

    if (!passwordCheck) {
      throw new UnauthorizedException('Wrong password');
    }
    return this.createToken(emailCheck.email);
  }

  createToken(email) {
    const payload = { email };
    const token = this.jwtService.sign(payload);
    return token;
  }
}
