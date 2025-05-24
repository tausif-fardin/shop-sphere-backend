import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { RegisterDto } from './dto/register.dto';
import { User } from '../users/schemas/user.schema';

// Define the document type locally since it's not exported
type UserWithMethods = User & {
  comparePassword(password: string): Promise<boolean>;
  toObject(): Record<string, any>;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<Partial<User> | null> {
    const user = (await this.usersService.findByEmail(
      email,
    )) as UserWithMethods;

    if (!user) {
      return null;
    }

    console.log('user', user);

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return null;
    }

    // Don't return the password
    const { password: _, ...result } = user.toObject();
    return result;
  }

  login(user: UserWithMethods) {
    const payload: JwtPayload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    return {
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: RegisterDto): Promise<User> {
    const user = await this.usersService.create({
      ...registerDto,
    });
    return user;
  }
}
